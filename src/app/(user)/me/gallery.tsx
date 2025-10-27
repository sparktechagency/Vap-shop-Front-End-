import { Card } from "@/components/ui/card";
import React from "react";

export default function Gallery() {
  return (
    <div className="w-full  pt-2">
      <div className="grid grid-cols-4 gap-2 relative">
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <Card className="w-full aspect-video" />
        <div className="top-1/2 left-1/2 -translate-1/2 w-full h-full absolute flex justify-center items-center bg-background/20 backdrop-blur-sm">
          <div className="w-2/3 p-12 bg-foreground/10 rounded-sm border flex justify-center items-center">
            Under Development
          </div>
        </div>
      </div>
    </div>
  );
}
