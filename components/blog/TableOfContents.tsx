"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Extract only h1, h2, and important h3 headings
  useEffect(() => {
    const extractMainHeadings = (text: string) => {
      // Updated regex to match only ## and ### (2-3 hashes)
      const regex = /^(#{2,3})\s+(.+)$/gm;
      const matches = Array.from(text.matchAll(regex));

      return matches
        .filter((match) => {
          const level = match[1].length;
          const text = match[2].toLowerCase();
          // Keep h2 and important h3 headings
          return (
            level === 2 || // H2 headings
            (level === 3 && // H3 headings with specific keywords
              (text.includes("introduction") ||
                text.includes("conclusion") ||
                text.includes("summary")))
          );
        })
        .map((match) => ({
          level: match[1].length - 1, // Adjust level to account for removed H1
          text: match[2],
          id: match[2]
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, "-"),
        }));
    };

    setHeadings(extractMainHeadings(content));
  }, [content]);

  // Enhanced intersection observer with better tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible heading
        let maxVisibility = 0;
        let mostVisibleId = "";

        entries.forEach((entry) => {
          // Calculate how much of the element is visible
          const intersectionRatio = entry.intersectionRatio;

          if (intersectionRatio > maxVisibility) {
            maxVisibility = intersectionRatio;
            mostVisibleId = entry.target.id;
          }
        });

        // Only update if we found a visible heading
        if (mostVisibleId && maxVisibility > 0.2) {
          setActiveId(mostVisibleId);

          // Smooth scroll the TOC item into view
          requestAnimationFrame(() => {
            const tocItem = document.querySelector(
              `[data-toc-id="${mostVisibleId}"]`
            );
            const scrollContainer = tocItem?.closest(
              "[data-radix-scroll-area-viewport]"
            );

            if (tocItem && scrollContainer && !isElementInViewport(tocItem)) {
              const containerRect = scrollContainer.getBoundingClientRect();
              const tocItemRect = tocItem.getBoundingClientRect();

              const relativeTop = tocItemRect.top - containerRect.top;
              const centerOffset =
                containerRect.height / 2 - tocItemRect.height / 2;

              scrollContainer.scrollTo({
                top: scrollContainer.scrollTop + relativeTop - centerOffset,
                behavior: "smooth",
              });
            }
          });
        }
      },
      {
        // Adjust these values for better desktop tracking
        rootMargin: "-10% 0px -45% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      }
    );

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Improved click handler for better scroll positioning
  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const header = document.querySelector("header");
    const headerOffset = header?.offsetHeight || 0;
    const padding = 24; // Additional padding

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
      window.pageYOffset + elementPosition - headerOffset - padding;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Set active immediately for better feedback
    setActiveId(id);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        !isMobile && "sticky top-24 max-h-[calc(100vh-8rem)]",
        isMobile &&
          "p-4 bg-background/60 backdrop-blur-md rounded-xl border border-border/50"
      )}
    >
      <h3 className="font-medium mb-4">On This Page</h3>
      <ScrollArea
        className={cn(
          "h-full",
          !isMobile ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-280px)]"
        )}
      >
        <nav className="pr-4">
          <ul className="space-y-1.5 relative">
            <AnimatePresence mode="wait">
              {headings.map((heading, index) => (
                <motion.li
                  key={heading.id}
                  data-toc-id={heading.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={cn(
                      "group flex items-center gap-2 w-full rounded-md",
                      "py-2 px-3 text-sm transition-all duration-200",
                      activeId === heading.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/50",
                      "relative"
                    )}
                    style={{
                      paddingLeft: `${heading.level * 12}px`,
                    }}
                  >
                    {/* Active indicator */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-200",
                        activeId === heading.id
                          ? "bg-primary scale-100"
                          : "bg-primary/0 scale-0"
                      )}
                    />

                    <ChevronRight
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        activeId === heading.id && "rotate-90 text-primary"
                      )}
                    />

                    <span className="truncate">{heading.text}</span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}

function isElementInViewport(el: Element) {
  if (typeof window === "undefined") return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
