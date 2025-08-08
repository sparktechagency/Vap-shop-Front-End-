/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountysQuery } from "@/redux/features/AuthApi";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";

export default function Regions() {
  const { data: countries, isLoading: cLoading } = useCountysQuery();

  return (
    <section className="w-full p-4 grid grid-cols-2 gap-6 items-baseline">
      {!cLoading &&
        countries?.data?.map((x: any) => (
          <React.Fragment key={x.id + x.name}>
            <Card>
              <CardHeader>
                <CardTitle> {x.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {x.regions.map((y: any) => (
                  <div
                    key={y.id + y.name}
                    className="py-2 px-4 shadow rounded-md flex flex-row justify-between items-center"
                  >
                    <div className="text-sm font-semibold">
                      {y.name}({y.code})
                    </div>
                    <div className="space-x-2">
                      <Button size={"icon"} variant={"outline"}>
                        <EditIcon />
                      </Button>
                      <Button size={"icon"} variant={"outline"}>
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
    </section>
  );
}
