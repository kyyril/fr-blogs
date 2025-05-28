'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogEditor } from '@/components/blog/editor';
import { toast } from '@/components/ui/use-toast';
import { ImageUpload } from '@/components/blog/image-upload';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(200, 'Excerpt must be less than 200 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url('Please upload a valid image').or(z.string().length(0)),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialData?: FormValues;
  isEditing?: boolean;
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: '',
      tags: [],
    },
  });

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      toast({
        title: 'Tag already exists',
        description: 'Please enter a different tag',
        variant: 'destructive',
      });
      return;
    }
    
    if (tags.length >= 5) {
      toast({
        title: 'Maximum tags reached',
        description: 'You can only add up to 5 tags',
        variant: 'destructive',
      });
      return;
    }
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Include tags in the submission
      const dataToSubmit = {
        ...values,
        tags,
      };
      
      // In a real app, this would be an API call
      console.log('Submitting form data:', dataToSubmit);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: isEditing ? 'Blog updated' : 'Blog created',
        description: isEditing 
          ? 'Your blog has been updated successfully' 
          : 'Your blog has been published successfully',
      });
      
      // Redirect to the blog page
      router.push('/blog');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'An error occurred',
        description: 'There was an error publishing your blog. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Cover Image */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Upload a cover image for your blog. Recommended size: 1200x630px.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormDescription>
                A catchy title that summarizes your blog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief summary of your blog"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short summary that appears in blog previews. Limited to 200 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your blog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          <FormDescription>
            Add up to 5 tags to help readers find your blog. Press Enter or click Add.
          </FormDescription>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <BlogEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Blog' : 'Publish Blog'}
          </Button>
        </div>
      </form>
    </Form>
  );
}