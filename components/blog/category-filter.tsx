"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, X, Filter } from "lucide-react";
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

// Filter content component that will be used in both desktop and mobile versions
function FilterContent() {
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
    <>
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
    </>
  );
}

// Desktop version - hidden on mobile
export function CategoryFilter() {
  return (
    <div className="w-full rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Categories</h2>
      <FilterContent />
    </div>
  );
}

// Mobile version - visible only on mobile
export function MobileCategoryFilter() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentTags = searchParams.get("tags") || "";

  // Show active filter count
  const activeFiltersCount = (currentCategory ? 1 : 0) + (currentTags ? 1 : 0);

  // Get display text for active filters
  const getFilterText = () => {
    if (currentCategory && currentTags) {
      return `${currentCategory}, #${currentTags}`;
    } else if (currentCategory) {
      return currentCategory;
    } else if (currentTags) {
      return `#${currentTags}`;
    }
    return "Filter & Categories";
  };

  return (
    <div className="md:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-12 px-4 text-left"
          >
            <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate flex-1">
              {activeFiltersCount > 0 ? getFilterText() : "Filter & Categories"}
            </span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground flex-shrink-0">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filter & Categories</SheetTitle>
            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-auto p-1 text-xs"
                >
                  <Link href="/blog">Clear all</Link>
                </Button>
              </div>
            )}
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
