'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { 
  Code, Laptop, Coffee, Heart, Briefcase, 
  Utensils, Camera, Globe, BookOpen, Activity 
} from 'lucide-react';

const categories = [
  { name: 'Technology', icon: Laptop, count: 42, color: 'bg-blue-100 dark:bg-blue-900' },
  { name: 'Programming', icon: Code, count: 35, color: 'bg-indigo-100 dark:bg-indigo-900' },
  { name: 'Lifestyle', icon: Coffee, count: 28, color: 'bg-yellow-100 dark:bg-yellow-900' },
  { name: 'Health', icon: Activity, count: 24, color: 'bg-green-100 dark:bg-green-900' },
  { name: 'Business', icon: Briefcase, count: 19, color: 'bg-purple-100 dark:bg-purple-900' },
  { name: 'Food', icon: Utensils, count: 17, color: 'bg-red-100 dark:bg-red-900' },
  { name: 'Photography', icon: Camera, count: 15, color: 'bg-pink-100 dark:bg-pink-900' },
  { name: 'Travel', icon: Globe, count: 14, color: 'bg-cyan-100 dark:bg-cyan-900' },
  { name: 'Books', icon: BookOpen, count: 12, color: 'bg-emerald-100 dark:bg-emerald-900' },
  { name: 'Wellness', icon: Heart, count: 10, color: 'bg-rose-100 dark:bg-rose-900' },
];

export function CategoryList() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.name}
            href={`/blog/category/${category.name.toLowerCase()}`}
            className="group flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-all hover:border-primary hover:shadow-sm"
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${category.color}`}>
              <Icon className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-medium group-hover:text-primary">{category.name}</h3>
            <Badge variant="secondary" className="bg-secondary/50">
              {category.count} posts
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}