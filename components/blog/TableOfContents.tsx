"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
  isMobile?: boolean;
}

export function TableOfContents({
  content,
  isMobile = false,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<
    Array<{ level: number; text: string; id: string }>
  >([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractHeadings = (text: string) => {
      const regex = /^(#{1,6})\s+(.+)$/gm;
      const matches = Array.from(text.matchAll(regex));

      return matches.map((match) => ({
        level: match[1].length,
        text: match[2],
        id: match[2]
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-"),
      }));
    };

    setHeadings(extractHeadings(content));
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust scroll position
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", isMobile ? "p-4" : "")}>
      <h3 className="font-medium mb-4">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "text-sm hover:text-primary transition-colors text-left w-full",
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
