"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Update the animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const codeBlockVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose prose-neutral dark:prose-invert max-w-none prose-lg"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // Basic text styling
          p: ({ children, ...props }) => (
            <p
              className="leading-7 text-foreground/70 [&:not(:first-child)]:mt-6"
              {...props}
            >
              {children}
            </p>
          ),

          // Clean heading styles
          h1: ({ children, ...props }) => (
            <h1
              className="text-4xl font-bold mb-8 text-foreground border-b border-border/20 pb-4"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-3xl font-bold mt-16 mb-6 text-foreground/90 scroll-mt-20 flex items-center gap-3"
              {...props}
            >
              <div className="w-1 h-8 bg-primary/60 rounded-full"></div>
              {children}
            </motion.h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-12 mb-4 text-foreground/80 scroll-mt-20 flex items-center gap-2"
              {...props}
            >
              <div className="w-1 h-6 bg-primary/40 rounded-full"></div>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xl font-semibold mt-8 mb-3 text-foreground/80 scroll-mt-20 border-l-2 border-primary/30 pl-4"
              {...props}
            >
              {children}
            </h4>
          ),

          // Clean code block
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            if (!inline && match) {
              return (
                <motion.div
                  variants={codeBlockVariants}
                  initial="initial"
                  animate="animate"
                  className="relative group my-8 rounded-lg overflow-hidden border border-border/30 dark:border-white/10"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-foreground/50">
                        {language}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(code)}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copiedCode === code ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-foreground/50" />
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={
                      isDark
                        ? {
                            ...oneDark,
                            comment: {
                              color: "#8b949e",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            prolog: {
                              color: "#8b949e",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            doctype: {
                              color: "#8b949e",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            cdata: {
                              color: "#8b949e",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                          }
                        : {
                            ...oneLight,
                            comment: {
                              color: "#6e7781",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            prolog: {
                              color: "#6e7781",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            doctype: {
                              color: "#6e7781",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                            cdata: {
                              color: "#6e7781",
                              fontStyle: "italic",
                              background: "transparent",
                            },
                          }
                    }
                    language={language}
                    PreTag="div"
                    className="!mt-0 !rounded-none !border-none"
                    customStyle={{
                      margin: 0,
                      background: "transparent",
                      padding: "1.25rem",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </motion.div>
              );
            }

            return (
              <code className="font-mono text-[0.9em] text-primary" {...props}>
                {children}
              </code>
            );
          },

          // Simplified blockquote
          blockquote: ({ children, ...props }) => (
            <motion.blockquote
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="my-8 border-l-2 border-primary/30 pl-6 py-3 text-foreground/60 italic"
              {...props}
            >
              {children}
            </motion.blockquote>
          ),

          // Cleaner link style
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
              {href?.startsWith("http") && (
                <ExternalLink className="h-3 w-3 opacity-50" />
              )}
            </a>
          ),

          // Simpler list items
          li: ({ children, ...props }) => (
            <li
              className="text-foreground/70 leading-relaxed flex items-start gap-3 my-2"
              {...props}
            >
              <div className="w-1 h-1 bg-primary/40 rounded-full mt-2.5 flex-shrink-0"></div>
              <span>{children}</span>
            </li>
          ),

          // Clean strong text
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground/90" {...props}>
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
