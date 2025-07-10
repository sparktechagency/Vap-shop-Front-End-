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
export default function MemberSub() {
  return (
    <div>
      <h1 className="my-12 text-4xl font-bold text-center">
        Choose Your Membership
      </h1>
      <div className="w-full p-6 grid grid-cols-3 gap-6 items-start">
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
              Advocacy Champion Membership
            </CardTitle>
            <CardDescription className="text-center w-full text-xs!">
              Power the platform and strengthen real-world advocacy. A portion
              of every subscription funds the platform and the fight to protect
              vapor access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pb-6">Your exclusive benefits include:</p>
            <ul className="list-disc list-inside text-sm">
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
            <h3 className="text-3xl font-black mt-12 text-center ">
              <sup className="font-semibold">For </sup>$6.00/month
            </h3>
            <p className="mt-12 font-semibold">
              🛡️ Why Join as an Advocacy Champion?
            </p>
            <ul className="list-disc list-inside mt-4 text-sm">
              <li>
                <b>Support critical industry advocacy:</b> Your subscription is
                a direct contribution to the cause.
              </li>
              <li>
                <b>Get real benefits:</b> Save money with discounts, enjoy
                events, and influence the platform&apos;s direction.
              </li>
              <li>
                <b>Be recognized:</b> Your badge shows the community you are a
                dedicated supporter.
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <CardAction className="w-full flex justify-center items-center">
              <Button asChild>
                <Link href={`/subscription/payment?type=acm`}>Subscribe</Link>
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
        <Card className="bg-gradient-to-tr from-transparent to-purple-400 dark:to-purple-800">
          <CardHeader>
            <CardTitle className="w-full text-center text-xl! uppercase">
              Advocacy Champion Membership
              <br />
              + <br />
              🌿Hemp Advocacy Add-On
            </CardTitle>
            <CardDescription className="text-center w-full text-xs!">
              Power the platform and strengthen real-world advocacy. A portion
              of every subscription funds the platform and the fight to protect
              vapor access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pb-6">Your exclusive benefits include:</p>
            <ul className="list-disc list-inside text-sm">
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
              <li>
                An additional $3/month supports hemp-specific advocacy (e.g.,
                TNHAA, KYHA)
              </li>
              <li>
                ncludes a distinct <b>“Hemp Advocacy Supporter”</b> badge
              </li>
            </ul>
            <h3 className="text-2xl font-black mt-12 text-center">
              <sup className="font-semibold">For </sup>$6.00/month + $3.00/month
            </h3>
            <p className="mt-12 font-semibold">
              🛡️ Why Join as an Advocacy Champion?
            </p>
            <ul className="list-disc list-inside mt-4 text-sm">
              <li>
                <b>Support critical industry advocacy:</b> Your subscription is
                a direct contribution to the cause.
              </li>
              <li>
                <b>Get real benefits:</b> Save money with discounts, enjoy
                events, and influence the platform&apos;s direction.
              </li>
              <li>
                <b>Be recognized:</b> Your badge shows the community you are a
                dedicated supporter.
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <CardAction className="w-full flex justify-center items-center">
              <Button variant="special" asChild>
                <Link href={`/subscription/payment?type=acmhaa`}>
                  Subscribe & Upgrade
                </Link>
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
