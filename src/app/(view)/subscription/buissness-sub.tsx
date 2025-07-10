import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export default function BuissnessSub() {
  return (
    <div>
      <h1 className="my-12 text-4xl font-bold text-center">
        Choose Your Membership
      </h1>
      <div className="w-full p-6 grid grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="w-full text-center">FREE</CardTitle>
            <CardDescription className="text-center w-full">
              (No cost - Full access)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm">
              <li>
                <b>Engage</b> in community discussions, leave reviews, and share
                tips.
              </li>
              <li>
                <b>Follow</b> the entire industry—from stores and brands to
                advocacy groups—and get updates in your social feed.
              </li>
              <li>
                <b>Explore</b> shops and products worldwide.
              </li>
            </ul>
            <p className="text-center font-semibold mx-auto mt-6 text-xs">
              🔁 Perfect for users who want full platform access without
              commitment.
            </p>
            <h3 className="text-2xl font-light mt-12 text-center">
              <sup className="font-semibold">For </sup>$0.00/month
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-transparent to-green-300 dark:to-green-800">
          <CardHeader>
            <CardTitle className="w-full text-center text-xl! uppercase">
              CASAA Advocacy Business Add‑On
            </CardTitle>
            <CardDescription className="text-center w-full text-xs!">
              The full $6/month funds CASAA.org, supporting its consumer
              advocacy efforts directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pb-6">Your exclusive benefits include:</p>
            <ul className="list-disc list-inside text-sm">
              <li>
                <b>Direct Advocacy Support:</b> 100% of the $6/month supports
                CASAA’s mission
              </li>
              <li>
                <b>Credibility & Trust </b> The CASAA badge signals genuine
                support for consumer-rights advocacy
              </li>
              <li>
                <b>Marketing Advantage:</b> Adds visible differentiation and
                positive industry positioning.
              </li>
              <li>
                <b>Consistent Funding Stream: </b>Reliable revenue aids CASAA’s
                monthly operations without reliance on fundraisers.
              </li>
            </ul>
            <h3 className="text-3xl font-black mt-12 text-center ">
              <sup className="font-semibold">For </sup>$6.00/month
            </h3>
          </CardContent>
          <CardFooter>
            <CardAction className="w-full flex justify-center items-center">
              <Button asChild>
                <Link href={`/subscription/payment?type=acm`}>Subscribe</Link>
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
