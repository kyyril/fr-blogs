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
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-purple-600 border-b border-gradient-to-r from-primary/20 to-transparent pb-4"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-3xl font-semibold mt-16 mb-6 text-foreground scroll-mt-20 flex items-center gap-3 group"
              {...props}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-12 mb-4 text-foreground scroll-mt-20 flex items-center gap-2"
              {...props}
            >
              <Sparkles className="h-5 w-5 text-primary/70" />
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xl font-semibold mt-8 mb-3 text-foreground scroll-mt-20 border-l-2 border-primary/30 pl-4"
              {...props}
            >
              {children}
            </h4>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            if (!inline && match) {
              return (
                <div className="relative group my-8 rounded-xl overflow-hidden shadow-lg border border-primary/10">
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-3 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full">
                        {language}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(code)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      {copiedCode === code ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    className="!mt-0 !rounded-none !border-none"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: isDark ? "#0f172a" : "#f8fafc",
                      padding: "1.5rem",
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className="px-2 py-1 rounded-md bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary font-mono text-sm border border-primary/20"
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-gradient-to-b from-primary to-purple-500 pl-8 py-4 my-8 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-r-xl italic relative overflow-hidden"
              {...props}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
              <div className="relative z-10">{children}</div>
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-8 rounded-xl border border-primary/10 shadow-sm">
              <table
                className="min-w-full border-collapse bg-gradient-to-br from-card to-primary/5"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-4 text-left font-semibold text-foreground"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border-b border-border/50 px-6 py-4 text-foreground"
              {...props}
            >
              {children}
            </td>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-primary hover:text-purple-600 underline decoration-primary/30 hover:decoration-purple-600/50 underline-offset-4 decoration-2 inline-flex items-center gap-1 transition-all duration-200 font-medium"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
              {href?.startsWith("http") && (
                <ExternalLink className="h-3 w-3 opacity-70" />
              )}
            </a>
          ),
          ul: ({ children, ...props }) => (
            <ul className="space-y-3 my-6" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="space-y-3 my-6" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              className="text-foreground leading-relaxed flex items-start gap-3"
              {...props}
            >
              <span className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2.5 flex-shrink-0"></span>
              <span>{children}</span>
            </li>
          ),
          p: ({ children, ...props }) => (
            <p
              className="text-foreground leading-relaxed my-6 text-base"
              {...props}
            >
              {children}
            </p>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-muted-foreground font-medium" {...props}>
              {children}
            </em>
          ),
          strong: ({ children, ...props }) => (
            <strong
              className="font-semibold text-foreground bg-gradient-to-r from-primary/10 to-transparent px-1 rounded"
              {...props}
            >
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
