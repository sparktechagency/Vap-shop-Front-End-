import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CheckoutForm from "./checkout-form";

export default function Page() {
  return (
    <main className="!py-12 !px-4 md:!px-[7%] grid grid-cols-7 gap-12">
      <div className="col-span-7">
        <h1 className="text-4xl font-bold">Checkout</h1>
      </div>
      <div className="col-span-5 !space-y-12">
        <Card>
          <CardContent>
            <CheckoutForm />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardDescription>Payment form here</CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your order</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <ol className="list-decimal list-inside !space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li className="flex justify-between w-full" key={i}>
                    <p>VooPoo - Vmate E2 Kit</p>
                    <p>100$</p>
                  </li>
                ))}
              </ol>
            </CardDescription>
          </CardContent>
          <Separator />
          <CardFooter>
            <div className="flex justify-between w-full">
              <p>Total</p>
              <p>600$</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
