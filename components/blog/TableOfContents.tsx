"use client";

import { useState, useEffect } from "react";

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

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`${isMobile ? "p-4 border-t" : ""}`}>
      <h3 className="font-medium mb-4">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <a
                href={`#${heading.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
