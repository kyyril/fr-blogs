export const mockBlogPost = `# Building Modern Web Applications with Next.js and React

*Published on December 15, 2024 • 8 min read*

## Introduction

Welcome to this comprehensive guide on building modern web applications. In this post, we'll explore the latest trends, best practices, and tools that make development both **efficient** and **enjoyable**.

> "The best way to predict the future is to create it." - Peter Drucker

## Table of Contents

This post covers several key areas:

- Getting started with modern frameworks
- Database integration patterns
- Performance optimization techniques
- Deployment strategies

## Getting Started

### Prerequisites

Before we dive in, make sure you have the following installed:

\`\`\`bash
# Install Node.js (version 18 or higher)
node --version

# Install pnpm package manager
npm install -g pnpm

# Create a new Next.js project
npx create-next-app@latest my-app
\`\`\`

### Project Structure

A well-organized project structure is crucial for maintainability:

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   └── common/
├── lib/
│   ├── utils.ts
│   └── db.ts
└── public/
    └── images/
\`\`\`

## Core Concepts

### Component Architecture

Modern React applications benefit from a component-driven architecture:

\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
\`\`\`

### State Management

For complex applications, consider these state management patterns:

1. **Local State**: Use \`useState\` for component-level state
2. **Context API**: Share state across component trees
3. **External Libraries**: Redux, Zustand, or Jotai for global state

## Database Integration

### Setting Up Prisma

\`\`\`javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

### Code Splitting

Implement dynamic imports for better performance:

\`\`\`typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('../components/HeavyComponent'),
  { loading: () => <div>Loading...</div> }
);

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <DynamicComponent />
    </div>
  );
}
\`\`\`

## Advanced Patterns

### Custom Hooks

Create reusable logic with custom hooks:

\`\`\`tsx
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
\`\`\`

## Testing Strategies

### Unit Testing with Jest

\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

## Deployment

### Vercel Deployment

Deploy your Next.js app with zero configuration:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy your app
vercel

# Set environment variables
vercel env add PRODUCTION
\`\`\`

## Best Practices Checklist

- ✅ Use TypeScript for type safety
- ✅ Implement proper error boundaries
- ✅ Optimize images with Next.js Image component
- ✅ Use proper SEO meta tags
- ✅ Implement loading states
- ✅ Add proper accessibility attributes

## Conclusion

Building modern web applications requires a thoughtful approach to architecture, performance, and user experience. By following these patterns and best practices, you'll create applications that are both maintainable and performant.

### What's Next?

1. Explore **Server Components** in Next.js 13+
2. Learn about **Edge Functions** for dynamic content
3. Implement **Progressive Web App** features
4. Study **Web3 integration** patterns

---

*Have questions or suggestions? Feel free to reach out on [Twitter](https://twitter.com) or check out the [GitHub repository](https://github.com) for this project.*

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
`;

export const mockQuickStart = `# Quick Start Guide

Get up and running in minutes with this streamlined setup process.

## Installation

\`\`\`bash
npm create next-app@latest
cd my-app
npm run dev
\`\`\`

## Key Features

- ⚡ **Fast**: Built on Vite for lightning-fast development
- 🎨 **Beautiful**: Pre-configured with Tailwind CSS
- 📝 **TypeScript**: Full type safety out of the box
- 🧪 **Testing**: Jest and Testing Library included

![image](https://dummyimage.com/600x400/000/fff)

> Start building amazing applications today!
`;

// Add export for all mock data
export const mockExamples = {
  blog: mockBlogPost,
  quick: mockQuickStart,
};
