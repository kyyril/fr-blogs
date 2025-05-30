"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BlogEditor } from "@/components/blog/editor";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBlog } from "@/hooks/useBlog";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.instanceof(File, "Please upload a valid image file").optional(),
  categories: z.array(z.string()).min(1, "Please select at least one category"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  readingTime: z.number().min(1, "Reading time must be at least 1 minute"),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  slug?: string;
  isEditing?: boolean;
}

export function BlogForm({ slug, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use the blog hooks
  const { createBlog, updateBlog, getBlogBySlug } = useBlog();

  // Fetch blog data for editing
  const {
    data: blogData,
    isLoading: isFetchingBlog,
    error: fetchError,
  } = getBlogBySlug(slug || "", { enabled: isEditing && !!slug });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      image: undefined,
      categories: [],
      tags: [],
      readingTime: 1,
      featured: false,
    },
  });

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditing && blogData) {
      const initialData = {
        title: blogData.title || "",
        description: blogData.description || "",
        content: blogData.content || "",
        readingTime: blogData.readingTime || 1,
        featured: blogData.featured || false,
      };

      // Set form values
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });

      // Set categories and tags
      if (blogData.categories) {
        setCategories(blogData.categories);
        form.setValue("categories", blogData.categories);
      }

      if (blogData.tags) {
        setTags(blogData.tags);
        form.setValue("tags", blogData.tags);
      }
    }
  }, [blogData, isEditing, form]);

  const availableCategories = [
    "Programming",
    "Backend Development",
    "Frontend Development",
    "Technology",
    "Lifestyle",
    "Health",
    "Business",
    "Food",
    "Photography",
    "Travel",
    "Books",
    "Wellness",
  ];

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      toast({
        title: "Tag already exists",
        description: "Please enter a different tag",
        variant: "destructive",
      });
      return;
    }

    if (tags.length >= 10) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 10 tags",
        variant: "destructive",
      });
      return;
    }

    const newTags = [...tags, tagInput.trim()];
    setTags(newTags);
    form.setValue("tags", newTags);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories;
    if (checked) {
      newCategories = [...categories, category];
    } else {
      newCategories = categories.filter((c) => c !== category);
    }
    setCategories(newCategories);
    form.setValue("categories", newCategories);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Prepare data object
      const dataToSubmit = {
        title: values.title,
        description: values.description,
        content: values.content,
        readingTime: values.readingTime,
        featured: values.featured,
        categories: categories,
        tags: tags,
        ...(values.image && { image: values.image }),
      };

      if (isEditing && slug) {
        const id = blogData?.id;
        // Update existing blog
        await updateBlog.mutateAsync({
          id,
          data: dataToSubmit,
        });

        toast({
          title: "Blog updated successfully",
          description: "Your blog has been updated and saved.",
        });
      } else {
        // Create new blog
        await createBlog.mutateAsync(dataToSubmit);

        toast({
          title: "Blog published successfully",
          description: "Your blog has been published and is now live.",
        });
      }

      // Redirect to blog list or blog detail
      router.push("/blog");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error occurred",
        description:
          error?.message ||
          (isEditing
            ? "Failed to update your blog. Please try again."
            : "Failed to publish your blog. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state when fetching blog data for editing
  if (isEditing && isFetchingBlog) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading blog data...</p>
        </div>
      </div>
    );
  }

  // Show error state if failed to fetch blog data
  if (isEditing && fetchError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Failed to load blog data</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Get loading state from mutations
  const isSubmitting =
    createBlog.isPending || updateBlog.isPending || isLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Cover Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Upload a cover image for your blog. Recommended size:
                1200x630px. Accepted formats: JPG, PNG, GIF.
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief description of your blog"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short description that appears in blog previews. Limited to
                200 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories */}
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormDescription>
                Select one or more categories that best fit your blog.
              </FormDescription>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {availableCategories.map((category) => (
                  <FormItem
                    key={category}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={categories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {category}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
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
                Add tags to help readers find your blog. Press Enter or click
                Add. At least one tag is required.
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reading Time */}
        <FormField
          control={form.control}
          name="readingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading Time (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter estimated reading time"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Estimated time to read the blog post in minutes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured */}
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Blog</FormLabel>
                <FormDescription>
                  Mark this blog as featured to highlight it on the homepage.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <BlogEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Publishing..."}
              </>
            ) : isEditing ? (
              "Update Blog"
            ) : (
              "Publish Blog"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
