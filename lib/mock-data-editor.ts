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

## Performance Optimization

### Key Metrics to Track

| Metric | Target | Description |
|--------|--------|-------------|
| **FCP** | < 1.8s | First Contentful Paint |
| **LCP** | < 2.5s | Largest Contentful Paint |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FID** | < 100ms | First Input Delay |

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

> Start building amazing applications today!
`;

export const Classic = `# Finding Peace in Everyday Moments

## Introduction

In our fast-paced world, it's easy to feel overwhelmed by endless to-do lists, social media feeds, and the constant buzz of notifications. But what if we could slow down and find peace in the small, everyday moments? This post explores simple ways to cultivate calmness and appreciation in your daily life.

> "Enjoy the little things, for one day you may look back and realize they were the big things." — Robert Brault

## Table of Contents

- Savoring Morning Rituals
- Embracing Nature's Calm
- Cultivating Gratitude
- Disconnecting to Reconnect
- Conclusion

## Savoring Morning Rituals

Mornings set the tone for the rest of the day. Instead of rushing, consider creating a gentle morning routine that invites peace and mindfulness. Try brewing a cup of tea or coffee, taking a few deep breaths, and savoring the quiet moments before the world fully wakes up.

## Embracing Nature's Calm

Spending time in nature can be a powerful antidote to stress. Whether it's a walk in the park, tending to a small garden, or simply opening your window to let in fresh air, these moments help us reconnect with the natural rhythms of life.

## Cultivating Gratitude

Gratitude has the power to transform ordinary days into blessings. Keep a small journal where you jot down three things you're grateful for each evening. It might be as simple as a smile from a stranger, a delicious meal, or the warmth of sunlight streaming through your window.

## Disconnecting to Reconnect

Technology is a wonderful tool, but it's easy to get lost in its glow. Consider setting boundaries—like a daily "digital sunset"—where you put your devices away and fully engage with yourself or loved ones. This creates space for real conversations, creativity, and rest.

## Conclusion

Finding peace doesn't always require grand gestures. Often, it's tucked away in the simplest of moments—a quiet morning, a grateful heart, a breath of fresh air. May you discover the joy of these everyday gifts, and may they fill your days with calm and contentment.

---

*Did you find this post helpful? Let me know in the comments below or connect with me on [Instagram](https://instagram.com).*

## References

- [The Power of Now by Eckhart Tolle](https://www.eckharttolle.com)
- [Mindfulness Practices](https://www.mindful.org)
`;

export const ArchLinux = `# The Ultimate Guide to Ricing Arch Linux

*Published on June 9, 2025 • 12 min read*

## Introduction

Customizing Arch Linux, often called "ricing" in the community, is both an art and a science. This guide will walk you through creating a beautiful, functional desktop environment that's uniquely yours.

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci 

## Prerequisites

Before we begin, ensure you have a working Arch Linux installation with the following:

\`\`\`bash
# Install essential packages
sudo pacman -S base-devel git xorg-server xorg-xinit

# Install AUR helper (yay)
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
\`\`\`

## Window Managers

Choose your window manager based on your needs:

| WM | Type | Resource Usage | Learning Curve |
|----|------|----------------|----------------|
| i3 | Tiling | Very Light | Moderate |
| bspwm | Tiling | Minimal | Steep |
| dwm | Tiling | Extremely Light | Very Steep |
| awesome | Dynamic | Light | Moderate |

### Installing i3-gaps

\`\`\`bash
# Install i3-gaps and essential tools
yay -S i3-gaps polybar picom rofi nitrogen

# Create initial config
mkdir -p ~/.config/i3
cp /etc/i3/config ~/.config/i3/
\`\`\`

## Essential Customization Tools

1. **Terminal Emulator**: Alacritty
2. **Status Bar**: Polybar
3. **Application Launcher**: Rofi
4. **Compositor**: Picom
5. **Notifications**: Dunst

### Terminal Setup

Install and configure Alacritty:

\`\`\`bash
yay -S alacritty
mkdir -p ~/.config/alacritty
\`\`\`

\`\`\`yaml
# ~/.config/alacritty/alacritty.yml
window:
  padding:
    x: 10
    y: 10
  opacity: 0.95

font:
  normal:
    family: JetBrainsMono Nerd Font
    style: Regular
  size: 11.0

colors:
  primary:
    background: '#282c34'
    foreground: '#abb2bf'
\`\`\`

## Theme Installation

Popular themes and how to install them:

### GTK Themes
\`\`\`bash
# Nordic Theme
yay -S nordic-theme-git

# Dracula Theme
yay -S dracula-gtk-theme

# Catppuccin Theme
yay -S catppuccin-gtk-theme-mocha
\`\`\`

### Icon Themes
\`\`\`bash
# Papirus Icons
sudo pacman -S papirus-icon-theme

# Nordic Folders
yay -S nordic-folders
\`\`\`

## Configuration Files

### i3 Config Example
\`\`\`bash
# ~/.config/i3/config
# Gaps configuration
gaps inner 10
gaps outer 5

# Border configuration
for_window [class="^.*"] border pixel 2
client.focused #88c0d0 #88c0d0 #ffffff #88c0d0

# Keybindings
bindsym $mod+Return exec alacritty
bindsym $mod+d exec rofi -show drun
bindsym $mod+Shift+c reload
\`\`\`

### Polybar Config
\`\`\`ini
; ~/.config/polybar/config.ini
[bar/main]
width = 100%
height = 27
radius = 0
fixed-center = true
background = #2e3440
foreground = #d8dee9

modules-left = i3
modules-center = date
modules-right = pulseaudio memory cpu
\`\`\`

## Advanced Customization

### Using Pywal
Generate color schemes from wallpapers:

\`\`\`bash
# Install pywal
yay -S python-pywal

# Generate and apply color scheme
wal -i ~/wallpapers/current.jpg
\`\`\`

### Automating with Scripts
\`\`\`bash
#!/bin/bash
# ~/.local/bin/theme-switch
wallpath=$1
wal -i $wallpath
pywal-discord
killall -q polybar
polybar main &
\`\`\`

## Performance Optimization

Monitor system resources:

\`\`\`bash
# Install monitoring tools
sudo pacman -S htop btop

# Optimize startup
systemctl --user disable some-heavy-service
systemctl --user enable sxhkd
\`\`\`

## Conclusion

Rice your Arch Linux setup gradually. Start with the basics and build up to more complex customizations as you learn. Remember to backup your dotfiles!

## Useful Resources

- [r/unixporn](https://reddit.com/r/unixporn)
- [Arch Wiki](https://wiki.archlinux.org)
- [i3 User Guide](https://i3wm.org/docs/userguide.html)
- [Dotfiles Community](https://github.com/topics/dotfiles)

---

*Share your rice on Reddit or GitHub! Tag me [@archuser](https://github.com/archuser)*
`;
export const mockCosmetics = `# The Ultimate Guide to Clean Beauty

*Published on June 8, 2025 • 10 min read*

## Introduction

The clean beauty movement has revolutionized the cosmetics industry. In this comprehensive guide, we'll explore what clean beauty means, essential ingredients to look for, and how to build a sustainable skincare routine.

> "Beauty is being comfortable and confident in your own skin." — Unknown

## What is Clean Beauty?

Clean beauty refers to products that are:

* Non-toxic
* Environmentally sustainable
* Ethically produced
* Transparent in ingredients

## Key Ingredients to Look For

| Ingredient | Benefits | Common Uses |
|------------|----------|-------------|
| Hyaluronic Acid | Hydration | Serums, Moisturizers |
| Vitamin C | Brightening | Face Oils, Serums |
| Niacinamide | Pore Refining | Toners, Serums |
| Squalane | Moisturizing | Face Oils, Creams |

## Building Your Routine

### Morning Routine

1. Gentle Cleanser
2. Hydrating Toner
3. Vitamin C Serum
4. Moisturizer
5. SPF

### Evening Routine

1. Double Cleanse
2. Treatment Serum
3. Night Cream
4. Face Oil

## Product Recommendations

Here are some clean beauty favorites:

\`\`\`markdown
- Cleanser: Fresh Soy Face Cleanser
- Toner: Paula's Choice BHA
- Serum: The Ordinary Niacinamide
- Moisturizer: OSEA Atmosphere Protection Cream
- SPF: Supergoop! Play
\`\`\`

## Sustainability Tips

* Choose products with minimal packaging
* Look for refillable options
* Support brands with recycling programs
* Buy only what you need

## Common Myths Debunked

### Myth 1: Natural Equals Safe
Not all natural ingredients are safe, and not all synthetic ingredients are harmful.

### Myth 2: Clean Beauty is Less Effective
Many clean formulations are backed by scientific research and deliver excellent results.

## Conclusion

Clean beauty is about making conscious choices for your skin and the environment. Start small, research thoroughly, and build a routine that works for you.

---

*Want to learn more? Follow me on [Instagram](https://instagram.com) for daily clean beauty tips.*

## References

- [EWG's Skin Deep Database](https://www.ewg.org/skindeep/)
- [Environmental Working Group](https://www.ewg.org)
- [Clean Beauty Journal](https://www.cleanbeautyjournal.com)
`;

// Add export for all mock data
export const mockExamples = {
  blog: mockBlogPost,
  quick: mockQuickStart,
  classic: Classic,
  archlinux: ArchLinux,
  cosmetics: mockCosmetics,
};
