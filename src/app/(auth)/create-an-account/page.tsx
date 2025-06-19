import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { registerStaticData } from "./static-data";
import Link from "next/link";

export default function Page() {
  return (
    <div className="!px-[7%] !py-8">
      <h1 className="text-center text-5xl !mb-12">Create an account</h1>

      <div className="!py-8 w-full grid grid-cols-3 gap-6">
        {registerStaticData.map((x, i) => (
          <Card
            key={i}
            className="w-full bg-gradient-to-br from-violet-500 to-violet-400 rounded-xl dark:shadow-2xl shadow-violet-500/50 flex flex-col justify-between items-center"
          >
            <CardHeader className="w-full">
              <CardTitle className="text-2xl font-bold text-center text-background dark:text-foreground w-full">
                {x.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between items-center w-full">
              <CardDescription className="text-center text-background dark:text-foreground w-full">
                {x.desciption}
              </CardDescription>
            </CardContent>
            <div className="!px-6 w-full">
              <CardAction className="w-full !mt-8">
                <Button
                  className="w-full text-foreground bg-background hover:bg-zinc-200 dark:hover:bg-zinc-900"
                  asChild
                >
                  <Link
                    href={`/register?as=${x.role}`}
                    className="text-foreground!"
                  >
                    Register as {x.role}
                  </Link>
                </Button>
              </CardAction>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
