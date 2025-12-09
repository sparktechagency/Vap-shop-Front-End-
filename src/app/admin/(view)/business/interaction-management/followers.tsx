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
import { useUpdateinteractionMutation } from "@/redux/features/admin/AdminApis";
import { useGetProfileQuery } from "@/redux/features/AuthApi";

type FollowersFormValues = {
  targetType: string;
  profileUrl: string;
  followerCount: number;
};

// Helper: Extract ID (e.g., 176) from https://site.com/profile/176?query=...
const extractIdFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  const match = url.match(/(\d+)(?!.*\d)/);
  return match ? match[1] : null;
};

export default function Followers() {
  // FIX 2: Fixed hook name casing
  const [updateInteraction, { isLoading: isUpdating }] =
    useUpdateinteractionMutation();

  const form = useForm<FollowersFormValues>({
    defaultValues: {
      targetType: "",
      profileUrl: "",
      followerCount: 0,
    },
  });

  // 1. WATCH: Real-time monitoring of the URL input
  const watchedUrl = form.watch("profileUrl");

  // 2. EXTRACT: Get ID immediately when URL changes
  const extractedId = useMemo(() => extractIdFromUrl(watchedUrl), [watchedUrl]);

  // 3. AUTO-FETCH: Automatically triggers when 'extractedId' is available
  const { data: userProfile, isLoading: isFetchingProfile } =
    useGetProfileQuery(
      { id: extractedId },
      {
        skip: !extractedId, // Skips the API call if no ID is found
      }
    );

  console.log('userProfile', userProfile);

  const onSubmit = async (values: FollowersFormValues) => {
    if (!extractedId) {
      toast.error("Please provide a valid profile URL first.");
      return;
    }

    try {
      const response = await updateInteraction({
        target_id: Number(extractedId), // Use the extracted ID
        target_type: "user",
        metric_type: "follower",
        count: Number(values.followerCount),
      }).unwrap();

      const userName = userProfile?.data?.full_name || "User";
      toast.success(`Followers updated successfully for ${userName}`);
      form.reset({
        ...values,
        profileUrl: "", // Clear URL after success
        followerCount: 0,
      });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update followers.");
      console.error(error);
    }
  };

  // Safe access to user data
  const user = userProfile?.data;

  console.log('user', user);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Manage Followers
      </h2>
      <p className="text-gray-600 mb-6">
        Paste a profile link to auto-preview the user, then set their follower
        count.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="profileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://vapeshopmaps.com/profile/176..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="followerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follower Count</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="e.g. 1500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- AUTOMATIC PREVIEW SECTION --- */}
          <div className="min-h-[90px] transition-all duration-300">
            {/* Loading State */}
            {isFetchingProfile && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            )}

            {/* Success State */}
            {!isFetchingProfile && user && (
              <div className="flex items-center p-4 bg-blue-50/50 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.full_name} />
                  <AvatarFallback className="bg-blue-200 text-blue-700">
                    {user.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="ml-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {user.full_name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      ID: {user.id}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 flex items-center gap-3">
                    <span>{user.role_label}</span>
                    <span className="text-gray-300">|</span>
                    <span>
                      Current Followers:{" "}
                      <strong className="text-gray-700">
                        {user.total_followers}
                      </strong>
                    </span>

                    <span className="text-sm text-gray-500">
                      real_follower_count: {user?.real_follower_count}
                    </span>
                    <span className="text-sm text-green-500">
                      Admin Adjustment: {user?.metric_adjustments[0].adjustment_count}
                    </span>

                  </div>
                </div>
              </div>
            )}

            {/* Error/Empty State */}
            {!isFetchingProfile && extractedId && !user && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span> No user found with ID:{" "}
                <strong>{extractedId}</strong>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isUpdating || !user} // Disable if no valid user loaded
          >
            {isUpdating ? "Processing Update..." : "Confirm & Update"}
          </Button>
        </form>
      </Form>
    </>
  );
}
