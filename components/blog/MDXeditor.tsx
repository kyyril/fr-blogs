"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Edit3,
  Download,
  Upload,
  FileText,
  Columns,
  Maximize2,
  Minimize2,
  Lightbulb, // Change from LightbulbIcon to Lightbulb
} from "lucide-react";
import { MDXRenderer } from "./MDXRenderer";
import { cn } from "@/lib/utils";
import {
  mockBlogPost,
  mockQuickStart,
  Classic,
  ArchLinux,
  mockCosmetics,
} from "@/lib/mock-data-editor";

interface BlogEditorProps {
  initialContent?: string;
  className?: string;
  onChange?: (value: string) => void;
  isFormEditor?: boolean; // Add this prop
}

export function BlogEditor({
  initialContent = "",
  className,
  onChange,
  isFormEditor = false, // Add default value
}: BlogEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">(
    "split"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
    // Always call onChange to update parent component
    onChange?.(value);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleContentChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleInsertSample = async (
    sample: "blog" | "quick" | "classic" | "arch" | "cosmetics"
  ) => {
    setIsLoading(true);
    try {
      let sampleContent;
      switch (sample) {
        case "blog":
          sampleContent = mockBlogPost;
          break;
        case "quick":
          sampleContent = mockQuickStart;
          break;
        case "classic":
          sampleContent = Classic;
          break;
        case "arch":
          sampleContent = ArchLinux;
          break;
        case "cosmetics":
          sampleContent = mockCosmetics;
          break;
      }
      handleContentChange(sampleContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border rounded-lg",
        isFullscreen && "fixed inset-0 z-50 bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="font-medium">MDX Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline">Examples</span>
            </Button>
            <div className="absolute right-0 mt-2 w-48 py-2 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertSample("blog");
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading...
                  </span>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Full Blog Post
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertSample("quick");
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading...
                  </span>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    Quick Start Guide
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertSample("classic");
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading...
                  </span>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Classic Template
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertSample("arch");
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading...
                  </span>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Arch Linux Guide
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertSample("cosmetics");
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading...
                  </span>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Cosmetics Sample
                  </>
                )}
              </button>
            </div>
          </div>

          <input
            type="file"
            accept=".md,.mdx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="ghost" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleSave(e);
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setIsFullscreen(!isFullscreen);
            }}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as any)}
      >
        <TabsList className="border-b p-2">
          <TabsTrigger value="edit">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="split">
              <Columns className="h-4 w-4 mr-2" />
              Split
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="edit" className="h-full">
            <div className="relative h-full">
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className={cn(
                  "h-full resize-none border-0 focus-visible:ring-0",
                  isLoading && "opacity-50"
                )}
                placeholder="Write your content in MDX..."
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="animate-spin">⏳</span>
                    Loading example...
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <div className="flex h-full">
              <div className="flex-1 overflow-auto p-4">
                <MDXRenderer content={content} />
              </div>
            </div>
          </TabsContent>

          {!isMobile && (
            <TabsContent value="split" className="h-full">
              <div className="flex h-full divide-x">
                <div className="flex-1 relative">
                  <Textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className={cn(
                      "h-full resize-none border-0 focus-visible:ring-0",
                      isLoading && "opacity-50"
                    )}
                    placeholder="Write your content in MDX..."
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="animate-spin">⏳</span>
                        Loading example...
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex">
                  <div className="flex-1 overflow-auto p-4">
                    <MDXRenderer content={content} />
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
