"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const categories = [
  { name: "All", slug: "" },
  { name: "Technology", slug: "technology" },
  { name: "Programming", slug: "programming" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Health", slug: "health" },
  { name: "Business", slug: "business" },
  { name: "Food", slug: "food" },
  { name: "Photography", slug: "photography" },
  { name: "Travel", slug: "travel" },
  { name: "Books", slug: "books" },
  { name: "Wellness", slug: "wellness" },
];

export function CategoryFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredCategories(categories);
  };

  return (
    <div className="w-full rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Categories</h2>

      <div className="relative mb-4">
        <Input
          type="search"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="pr-8"
        />
        {searchTerm ? (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-1">
          {filteredCategories.map((category) => (
            <Button
              key={category.slug}
              variant="ghost"
              className={`w-full justify-start text-left ${
                currentCategory === category.slug
                  ? "bg-secondary font-medium"
                  : ""
              }`}
              asChild
            >
              <Link
                href={
                  category.slug
                    ? `${pathname}?category=${category.slug}`
                    : pathname
                }
              >
                {category.name}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "nextjs",
            "react",
            "typescript",
            "javascript",
            "css",
            "design",
            "ux",
          ].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="h-7 rounded-full text-xs"
              asChild
            >
              <Link href={`${pathname}?tags=${tag}`}>#{tag}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
