"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ShieldCheck } from "lucide-react";

export default function AgePopup() {
  const [hydrated, setHydrated] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  useEffect(() => {
    const confirm = localStorage.getItem("ageConfirmed");
    if (confirm) {
      setAgeConfirmed(true);
    }
    setHydrated(true); // we only render after this
  }, []);

  if (!hydrated || ageConfirmed) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4! z-50 bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow-xl rounded-2xl">
        <CardContent className="p-6! pb-0! sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6!">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-full p-3! shadow-lg">
                <Image
                  src="/image/VSM_VAPE.svg"
                  height={80}
                  width={80}
                  alt="VSM Vape Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-5!">
            <div className="space-y-2!">
              <div className="flex items-center justify-center gap-2 mb-3!">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">
                  Age Verification Required
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Are you 18 or older?
              </h1>
            </div>

            <Separator className="my-5!" />

            <div className="space-y-4! text-left text-sm sm:text-base">
              <p className="text-muted-foreground leading-relaxed">
                This vape shop requires age verification due to the nature of
                its products, which are intended strictly for adults aged 18 and
                over.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4!">
                <p className="text-amber-800 font-medium text-sm sm:text-sm">
                  ⚠️ By proceeding, I confirm that I am at least 18 years old
                  and understand that this website contains age-restricted
                  material.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6! sm:p-8! pt-0! flex flex-col space-y-3!">
          <Button
            className="w-full"
            onClick={() => {
              localStorage.setItem("ageConfirmed", "true");
              setAgeConfirmed(true);
            }}
            size="lg"
          >
            Yes, I&apos;m 18 or Older
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = "https://neal.fun/";
            }}
            size="lg"
          >
            No, I&apos;m Under 18
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
