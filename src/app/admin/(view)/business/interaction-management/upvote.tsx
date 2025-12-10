"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useUpdateinteractionMutation } from "@/redux/features/admin/AdminApis";
import { useGetPostByIdQuery } from "@/redux/features/users/postApi";


type UpvoteFormValues = {
  postIdInput: string; // Changed name to indicate it accepts ID or URL
  upvoteCount: number;
};

// Helper: Extract ID from URL or return the raw ID if it's just a number
const extractId = (input: string | undefined): string | null => {
  if (!input) return null;
  // If input is just numbers (e.g. "2"), return it
  if (/^\d+$/.test(input)) return input;

  // Try to extract from URL
  try {
    const match = input.match(/\/(\d+)(\?|$)/); // Matches number before ? or end of string
    return match ? match[1] : null;
  } catch (e) {
    console.log('e', e);
    return null;
  }
};

export default function Upvote() {
  const [updateInteraction, { isLoading: isUpdating }] = useUpdateinteractionMutation();

  const form = useForm<UpvoteFormValues>({
    defaultValues: {
      postIdInput: "",
      upvoteCount: 0,
    },
  });

  // 1. WATCH: Monitor the input
  const watchedInput = form.watch("postIdInput");

  // 2. EXTRACT: Get ID immediately
  const extractedId = useMemo(() => extractId(watchedInput), [watchedInput]);

  // 3. AUTO-FETCH: Fetch Post Details
  const {
    data: postData,
    isLoading: isFetchingPost
  } = useGetPostByIdQuery(
    { id: String(extractedId) },
    {
      skip: !extractedId,
    }
  );

  const onSubmit = async (values: UpvoteFormValues) => {
    if (!extractedId) {
      toast.error("Please provide a valid Post ID or URL.");
      return;
    }

    try {
      const response = await updateInteraction({
        target_id: extractedId,
        target_type: "post",
        metric_type: "upvote",
        count: Number(values.upvoteCount),
      }).unwrap();
      console.log('response', response);
      const postTitle = postData?.data?.title || "Post";
      toast.success(`Upvotes updated successfully for "${postTitle}"`);
      form.reset({
        postIdInput: "",
        upvoteCount: 0,
      });
    } catch (error) {
      toast.error("Failed to update upvotes.");
      console.error(error);
    }
  };

  const post = postData?.data;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Upvotes</h2>
      <p className="text-gray-600 mb-6">Easily update upvotes (likes) of posts.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postIdInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post ID or URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. 2 or https://.../post/2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upvoteCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upvote Count</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Set total upvotes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- AUTOMATIC PREVIEW SECTION --- */}
          <div className="min-h-[100px] transition-all duration-300">
            {/* Loading State */}
            {isFetchingPost && (
              <div className="p-4 bg-gray-50 border rounded-lg animate-pulse space-y-3">
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              </div>
            )}

            {/* Success State */}
            {!isFetchingPost && post && (
              <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4">
                  {/* Header: Author Info */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.user?.avatar} />
                        <AvatarFallback>{post.user?.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.user?.full_name}</p>
                        <p className="text-xs text-gray-500">{post.user?.role_label}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                      👍 {post.real_like_count} Real Likes
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                      Admin Likes 👍 {post.real_like_count - post.like_count}
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                      👍 {post.like_count} Total Likes
                    </Badge>
                  </div>

                  {/* Body: Content */}
                  <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="mt-2 text-xs text-gray-400">
                    Post ID: {post.id} • Created: {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Error/Empty State */}
            {!isFetchingPost && extractedId && !post && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span> No Post found with ID: <strong>{extractedId}</strong>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isUpdating || !post}
          >
            {isUpdating ? "Updating..." : "Confirm & Update"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Steps:</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
          <li>As admin, go to the post and copy the ID or URL.</li>
          <li>Paste it into the input above (Wait for preview).</li>
          <li>Set the total upvote count.</li>
          <li>Click Confirm to update.</li>
        </ol>
      </div>
    </>
  );
}