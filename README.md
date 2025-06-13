# SyncBlog

SynBlog is a modern blog application built with Next.js, TypeScript, and Tailwind CSS. It provides a platform for users to create, read, update, and delete blog posts, interact with comments, and manage user profiles.

## Features

- User authentication (Login/Register)
- Create, edit, and delete blog posts
- Rich text editing for blog content (MDX)
- Category-based blog filtering
- User profiles with followers/following
- Commenting system for blog posts

## Technologies Used

- **Frontend:**
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Redux Toolkit (for state management)

## Setup Instructions

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kyyril/fr-blogs.git
   cd fr-blogs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env.local` file in the root directory and add the necessary environment variables. An example `.env.development` and `.env.production` are provided. You might need to configure:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   # Add any other environment variables required by your backend API or OAuth providers
   ```

## Running the Project

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:3000`.

## Project Structure

```
.
├── app/                  # Next.js pages and routes
├── components/           # Reusable React components
├── constants/            # Application-wide constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and types
├── providers/            # Context providers for the application
├── services/             # API service integrations
├── store/                # Redux store configuration and slices
├── styles/               # Global styles
├── public/               # Static assets
├── .env.development      # Environment variables for development
├── .env.production       # Environment variables for production
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```
