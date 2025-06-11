"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Table,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";
import { MDXRenderer } from "./MDXRenderer";
import { cn } from "@/lib/utils";
import { mockBlogPost, mockQuickStart } from "@/lib/mock-data-editor";
import { useCallback } from "react";

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

  const handleInsertSample = async (sample: "blog" | "quick") => {
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
      }
      handleContentChange(sampleContent);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolbarButtonClick = useCallback(
    (command: string, event: React.MouseEvent<HTMLButtonElement>) => {
      // Basic implementation - can be expanded
      event.preventDefault(); // Prevent form submission
      if (isFormEditor) {
        event.stopPropagation(); // Stop event from propagating to the form
      }
      let newContent = content;
      switch (command) {
        case "bold":
          newContent = content + "**bold**";
          break;
        case "italic":
          newContent = content + "*italic*";
          break;
        case "underline":
          newContent = content + "<u>underline</u>";
          break;
        case "code":
          newContent = content + "```bash\ncode\n```";
          break;
        case "bulletList":
          newContent = content + "- bullet list";
          break;
        case "orderedList":
          newContent = content + "1. ordered list";
          break;
        case "h1":
          newContent = content + "# Heading 1";
          break;
        case "h2":
          newContent = content + "## Heading 2";
          break;
        case "h3":
          newContent = content + "### Heading 3";
          break;
        case "quote":
          newContent = content + "> quote";
          break;
        case "link":
          newContent = content + "[link](https://example.com)";
          break;
        case "image":
          newContent =
            content + "![image](https://dummyimage.com/600x400/000/fff)";
          break;
        case "table":
          newContent =
            content + "| header 1 | header 2 |\n|---|---| \n| row 1 | row 2 |";
          break;
        default:
          break;
      }
      handleContentChange(newContent);
    },
    [content, handleContentChange, isFormEditor]
  );

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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="hidden md:inline">Examples</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Insert Example</DialogTitle>
                <DialogDescription>
                  Choose an example to insert into the editor.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInsertSample("blog");
                  }}
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
                </Button>
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInsertSample("quick");
                  }}
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
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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

      {/* Toolbar */}
      <div className="flex items-center p-2 border-b gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("bold", e)}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("italic", e)}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("underline", e)}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("code", e)}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("bulletList", e)}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("orderedList", e)}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("h1", e)}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("h2", e)}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("h3", e)}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("quote", e)}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("link", e)}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("image", e)}
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleToolbarButtonClick("table", e)}
        >
          <Table className="h-4 w-4" />
        </Button>
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
                rows={20}
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
