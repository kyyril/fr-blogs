"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BlogEditor } from "@/components/blog/editor";
import { ImageUpload } from "@/components/blog/image-upload";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBlog } from "@/hooks/useBlog"; // Import the blog hook

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
  initialData?: Partial<FormValues>;
  isEditing?: boolean;
  blogId?: string; // Add blogId for editing
}

export function BlogForm({
  initialData,
  isEditing = false,
  blogId,
}: BlogFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<string[]>(
    initialData?.categories || []
  );

  // Use the blog hook
  const { createBlog, updateBlog } = useBlog();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      image: undefined, // File objects can't have default values
      categories: initialData?.categories || [],
      tags: initialData?.tags || [],
      readingTime: initialData?.readingTime || 1,
      featured: initialData?.featured || false,
    },
  });

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
    try {
      // Prepare data object first
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

      if (isEditing && blogId) {
        // Update existing blog
        await updateBlog.mutateAsync({
          id: blogId,
          data: dataToSubmit,
        });

        toast({
          title: "Blog updated",
          description: "Your blog has been updated successfully",
        });
      } else {
        // Create new blog
        console.log("Data to submit:", dataToSubmit);
        await createBlog.mutateAsync(dataToSubmit);

        toast({
          title: "Blog created",
          description: "Your blog has been published successfully",
        });
      }

      // Redirect to the blog page
      router.push("/blog");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "An error occurred",
        description: isEditing
          ? "There was an error updating your blog. Please try again."
          : "There was an error publishing your blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get loading state from mutations
  const isSubmitting = createBlog.isPending || updateBlog.isPending;

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

        {/* Description (formerly Excerpt) */}
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

        {/* Categories (Multiple Selection) */}
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

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              console.log("=== TOKEN DEBUG ===");
              const token = document.cookie;
              console.log("All cookies:", token);

              // Check if useBlog hook has the token
              console.log("Auth state from hook:", typeof createBlog);

              // Manual token check
              import("js-cookie").then((Cookies) => {
                const rawToken = Cookies.default.get("auth_token");
                console.log("Raw auth token:", rawToken);
                if (rawToken) {
                  try {
                    const decoded = atob(rawToken);
                    console.log(
                      "Decoded token:",
                      decoded.substring(0, 50) + "..."
                    );
                  } catch (e) {
                    console.log("Token decode error:", e);
                  }
                }
              });
            }}
          >
            Debug Token
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Publishing..."
              : isEditing
              ? "Update Blog"
              : "Publish Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
