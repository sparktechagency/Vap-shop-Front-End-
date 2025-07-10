import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CannabisIcon } from "lucide-react";
import React from "react";

export default function MembershipInfo({ member }: { member?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" type="button">
          <CannabisIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Choose Your Membership</DialogTitle>
        </DialogHeader>
        <div className="w-full p-6 grid grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="w-full text-center">
                FREE MEMBERSHIP
              </CardTitle>
              <CardDescription className="text-center w-full">
                (No cost - Full access)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>
                  <b>Engage</b> in community discussions, leave reviews, and
                  share tips.
                </li>
                <li>
                  <b>Follow</b> the entire industry—from stores and brands to
                  advocacy groups—and get updates in your social feed.
                </li>
                <li>
                  <b>Explore</b> shops and products worldwide.
                </li>
              </ul>
              <p className="text-center font-semibold mx-auto mt-6">
                🔁 Perfect for users who want full platform access without
                commitment.
              </p>
              <h3 className="text-3xl font-light mt-12 text-center">
                <sup className="font-semibold">For </sup>$0.00/month
              </h3>
            </CardContent>
          </Card>
          {member ? <MemberCard /> : <BuissnessCard />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BuissnessCard() {
  return (
    <Card className="bg-gradient-to-tr from-transparent to-green-300 dark:to-green-800">
      <CardHeader>
        <CardTitle className="w-full text-center text-xl! uppercase">
          CASAA Advocacy Business Add‑On
        </CardTitle>
        <CardDescription className="text-center w-full text-xs!">
          The full $6/month funds CASAA.org, supporting its consumer advocacy
          efforts directly
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
            <b>Credibility & Trust </b> The CASAA badge signals genuine support
            for consumer-rights advocacy
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
    </Card>
  );
}

function MemberCard() {
  return (
    <Card className="bg-gradient-to-tr from-transparent to-green-300 dark:to-green-800">
      <CardHeader>
        <CardTitle className="w-full text-center text-2xl! uppercase">
          Advocacy Champion Membership
        </CardTitle>
        <CardDescription className="text-center w-full">
          Power the platform and strengthen real-world advocacy. A portion of
          every subscription funds the platform and the fight to protect vapor
          access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="pb-6">Your exclusive benefits include:</p>
        <ul className="list-disc list-inside">
          <li>
            <b>Permanent</b> 10% discount at every participating vape shop
          </li>
          <li>
            <b>Early-access</b> voting on new platform features
          </li>
          <li>
            <b>50% off tickets</b> to all VSM-hosted events
          </li>
          <li>
            <b>A visible “Advocacy Champion” badge on your profile</b>
          </li>
        </ul>
        <h3 className="text-3xl font-black mt-12 text-center text-amber-500">
          <sup className="font-semibold">For </sup>$6.00/month
        </h3>
        <p className="mt-12 font-semibold">
          🛡️ Why Join as an Advocacy Champion?
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>
            <b>Support critical industry advocacy:</b> Your subscription is a
            direct contribution to the cause.
          </li>
          <li>
            <b>Get real benefits:</b> Save money with discounts, enjoy events,
            and influence the platform&apos;s direction.
          </li>
          <li>
            <b>Be recognized:</b> Your badge shows the community you are a
            dedicated supporter.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
