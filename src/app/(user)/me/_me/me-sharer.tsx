"use client";

import { UserData } from "@/lib/types/apiTypes";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";

export default function MeSharer({ me }: { me: UserData }) {
  const shareMe = (x: typeof me) => {
    if (Number(x.role) === 5) {
      return `/stores/store/${x.id}`;
    } else if (Number(x.role) === 3) {
      return `/brands/brand/${x.id}`;
    } else {
      return `/profile/${x.id}?user=${x?.full_name
        ?.trim()
        .replace(/\s+/g, " ")}`;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${me.full_name}'s Profile`,
          text: `Check out ${me.full_name}'s profile on VapeShopMaps.`,
          url: `${typeof window !== "undefined" ? shareMe(me) : "#"}`,
        })
        // .then(() => toast.success("Successfully shared your profile"))
        .catch((err) => console.error("Share failed:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="hidden md:flex"
      onClick={handleShare}
    >
      <Share2Icon />
    </Button>
  );
}
