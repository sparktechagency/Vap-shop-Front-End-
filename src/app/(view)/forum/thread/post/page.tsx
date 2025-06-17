import CommentCard from "@/components/core/comment-card";
import GoBack from "@/components/core/internal/go-back";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import React from "react";

export default function Page() {
  return (
    <main className="!my-12 !px-4 lg:!px-[7%] !space-y-12">
      <GoBack />
      <Card className="flex flex-row justify-between items-center">
        <CardHeader className="flex flex-row justify-between w-full h-full">
          <div className="flex flex-row gap-4 h-full items-center">
            <Avatar className="size-26">
              <AvatarImage /> <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <div className="!h-full flex flex-col justify-center">
              <h3 className="text-base md:text-xl font-bold">David Thompson</h3>
              <div className="!space-x-2 !space-y-2">
                <Badge>Creator</Badge>
                <Badge variant="special">Premium</Badge>
                <Badge variant="outline">Member</Badge>
              </div>
            </div>
          </div>
          <div className=""></div>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold">FORUMS FOR ECF SUPPLIERS</h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias,
            quibusdam odit eius aperiam vero quas eos illo voluptatibus dolorem
            illum dolor, minus itaque repellat expedita nesciunt dolore rem
            obcaecati tempore!
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-4">
        <Input
          placeholder="what's on your mind??"
          className="text-xs sm:text-sm lg:text-base"
        />{" "}
        <Button>Comment</Button>
      </div>
      <Card>
        <CardContent className="!space-y-4">
          <CommentCard /> <CommentCard /> <CommentCard /> <CommentCard />
        </CardContent>
      </Card>
    </main>
  );
}
