"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";

import { useEffect, useState } from "react";

export default function ReplyCard() {
  const [mounted, setMouted] = useState(false);

  useEffect(() => {
    setMouted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className="!py-12 flex justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      </>
    );
  }
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b !p-4">
        <div className="flex items-center gap-3 font-semibold text-base">
          <Avatar className="size-10">
            <AvatarImage src="/image/icon/user.jpeg" className="object-cover" />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          Irene Adler
        </div>
      </div>

      {/* Content */}
      <div className="!p-4 text-xs md:text-sm text-muted-foreground">
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
    </div>
  );
}
