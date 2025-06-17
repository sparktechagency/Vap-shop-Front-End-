"use client";
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
import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function FeedCard({
  data,
}: {
  data: { name: string; avatar: string };
}) {
  const [liked, setLiked] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            <AvatarImage src={data.avatar} />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          {data.name}
        </div>
      </div>

      {/* Content */}
      <div className="!p-4 text-sm text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nisi odio,
        auctor sed efficitur a, volutpat a orci. Etiam mollis mi eget ipsum
        consequat, vitae aliquam dolor hendrerit. Nulla facilisi. Quisque ut
        risus sed massa placerat mollis ut et augue. Proin volutpat viverra
        sapien, id euismod ipsum consectetur vitae. Praesent sodales lacus
        suscipit posuere facilisis. Maecenas tortor purus, lobortis sed posuere
        ut, auctor eleifend lacus. Donec vitae condimentum neque. In in mollis
        purus. Sed accumsan porta magna, id porta mi tempus sed. Etiam sed quam
        at urna molestie posuere ut quis diam. Duis mattis ornare fermentum. Sed
        eget metus massa. Suspendisse non leo sit amet nisi vestibulum
        vestibulum. Sed sit amet molestie velit. Nam et ultricies augue.
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
              <DialogTitle>Reply to {data.name}</DialogTitle>
              <DialogDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nisi
                odio, auctor sed efficitur a, volutpat a orci. Etiam mollis mi
                eget ipsum consequat, vitae aliquam dolor hendrerit. Nulla
                facilisi. Quisque ut risus sed massa placerat mollis ut et
                augue. Proin volutpat viverra sapien, id euismod ipsum
                consectetur vitae. Praesent sodales lacus suscipit posuere
                facilisis. Maecenas tortor purus, lobortis sed posuere ut,
                auctor eleifend lacus. Donec vitae condimentum neque. In in
                mollis purus. Sed accumsan porta magna, id porta mi tempus sed.
                Etiam sed quam at urna molestie posuere ut quis diam. Duis
                mattis ornare fermentum. Sed eget metus massa. Suspendisse non
                leo sit amet nisi vestibulum vestibulum. Sed sit amet molestie
                velit. Nam et ultricies augue.
              </DialogDescription>
              <DialogFooter className="border-t !py-4">
                <div className="w-full flex flex-row gap-3">
                  <Input placeholder="Type here.." />
                  <Button variant="special">Send</Button>
                </div>
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
