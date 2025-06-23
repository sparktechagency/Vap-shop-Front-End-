/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageCircle, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  useCommentPostMutation,
  useGetCommentQuery,
} from "@/redux/features/users/postApi";
import Namer from "./internal/namer";

const schema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export default function PostCard({
  data,
  user,
}: {
  data: any;
  user: { name: string; avatar: string };
}) {
  const [liked, setLiked] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const [comment] = useCommentPostMutation();
  const { data: comments, refetch } = useGetCommentQuery({ id: data.id });

  type FormSchema = z.infer<typeof schema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    console.log("Message sent:", values.message);
    try {
      const response: { ok?: string } = await comment({
        post_id: data.id,
        comment: values.message,
      }).unwrap();
      console.log(response);
      if (!response.ok) {
        toast.error("SOmething went wrong!");
        return;
      }
      await refetch();
      toast.success("Commented successfully.");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to comment. Please try again."
      );
      console.error("Comment failed:", error);
    }
    form.reset();
  };

  if (comments) {
    console.log(comments.data.data);
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          {user.name}
        </div>
      </div>
      {/* <div className="!p-4 border-b text-sm leading-relaxed font-semibold">
        {data?.title}
      </div> */}
      {/* Content */}
      <div className="!p-4 text-sm text-muted-foreground leading-relaxed">
        {data.content}
      </div>

      {/* Footer */}
      <div className="border-t !p-2 flex flex-row justify-between items-center bg-secondary">
        <div className="!space-x-2">
          <Button
            variant="ghost"
            onClick={() => {
              toast(
                `${liked ? "Removed like from" : "Liked"} ${data.name}s Post!!`
              );
              setLiked(!liked);
            }}
          >
            <ArrowBigUp
              fill={
                liked
                  ? resolvedTheme === "dark"
                    ? "#ffffff"
                    : "#191919"
                  : resolvedTheme === "dark"
                  ? "#191919"
                  : "#ffffff"
              }
            />
            11k
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <MessageCircle /> Reply
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Reply to {user.name}</DialogTitle>
              <DialogDescription>{data.content}</DialogDescription>
              {comments?.data?.data.map((x: any) => (
                <div className="pt-6! border-t" key={x.id}>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={x.user.avatar} />
                      <AvatarFallback>UI</AvatarFallback>
                    </Avatar>
                    <Namer
                      name={x.user.full_name}
                      type={String(x.user.role_label).toLowerCase()}
                      size="sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2!">
                    {x.comment}
                  </p>
                </div>
              ))}
              <DialogFooter className="border-t !py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-row gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Type here.." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="special">
                      Send
                    </Button>
                  </form>
                </Form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button variant="ghost">
            <Share2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
