# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Define build arguments for public environment variables
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_API_URL

# Set environment variables for public variables
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set environment variable to skip data fetching during build
ENV SKIP_BUILD_DATA_FETCH=true

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for Next.js
ENV NODE_ENV production

# Copy necessary files from the builder stage for standalone output
# The .next/standalone directory contains the server.js and all necessary node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
