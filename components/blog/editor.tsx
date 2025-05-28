'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Link,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [tab, setTab] = useState('write');

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let formattedText = '';
    let cursorPosition = 0;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorPosition = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorPosition = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorPosition = 3;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText}`;
        cursorPosition = 3;
        break;
      case 'ol':
        formattedText = `\n1. ${selectedText}`;
        cursorPosition = 4;
        break;
      case 'h1':
        formattedText = `\n# ${selectedText}`;
        cursorPosition = 3;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText}`;
        cursorPosition = 4;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText}`;
        cursorPosition = 3;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        cursorPosition = 1;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](url)`;
        cursorPosition = 2;
        break;
      default:
        return;
    }

    const newValue =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Set cursor position after the formatting
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(
          start + formattedText.length - (selectedText.length + cursorPosition),
          end + formattedText.length - (selectedText.length + cursorPosition)
        );
      } else {
        textarea.setSelectionRange(
          start + cursorPosition,
          start + cursorPosition
        );
      }
    }, 0);
  };

  return (
    <div className="border rounded-md">
      <div className="border-b bg-muted/50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('h1')}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('h2')}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('quote')}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('ul')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('ol')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('link')}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => formatText('image')}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="border-b px-4">
          <TabsList className="grid w-40 grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="p-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[400px] resize-y rounded-none border-0 p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Write your blog content here... Use Markdown formatting."
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0">
          <div className="prose prose-sm max-w-none p-4 dark:prose-invert md:prose-base">
            {/* This would normally use a markdown parser like react-markdown */}
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }} />
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}