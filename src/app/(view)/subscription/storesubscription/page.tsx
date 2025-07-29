/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGetstoreAdonsQuery,
  useGetSubscriptionDetailsQuery,
  useSendSubscriptionToAdminMutation,
} from "@/redux/features/store/SubscriptionApi";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// A simple SVG for checkmarks, used in feature lists
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 10 10"
    fill="none"
    className="flex-shrink-0 mt-1"
  >
    <path
      d="M8.33329 2.5L3.74996 7.08333L1.66663 5"
      stroke="#09090B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StoreSubscriptionPage: NextPage = () => {
  // --- State and Data Fetching ---
  const router = useRouter();
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {}
  );
  const [sendSubscriptionToAdmin, { isLoading: isSubscribing }] =
    useSendSubscriptionToAdminMutation();
  // Fetch subscription and add-on data
  const {
    data: subscriptionDetails,
    isLoading: isLoadingSubscription,
    refetch,
  } = useGetSubscriptionDetailsQuery({ type: "store" });
  const { data: adonsdata, isLoading: isLoadingAdons } =
    useGetstoreAdonsQuery();

  // --- Memoized Data Extraction ---
  const subscription = subscriptionDetails?.data?.[0];
  const addons = adonsdata?.data;

  // --- Event Handlers ---
  const handleToggleAddon = (addonId: number) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  const onRegisterClick = useCallback(async () => {
    if (!subscription) return;

    const plan_ids = [
      subscription.id,
      ...Object.keys(selectedAddons).filter((id) => selectedAddons[id]),
    ];

    try {
      const response = await sendSubscriptionToAdmin({ plan_ids }).unwrap();
      console.log("response", response);
      if (response.ok) {
        toast.success(response.message || "Subscribed successfully");
        refetch();
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(error?.data?.message || "Failed to Subscribe");
    }
  }, [subscription, selectedAddons, router]);

  // --- Loading State ---
  if (isLoadingSubscription || isLoadingAdons) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <p className="text-lg font-semibold">Loading Plans...</p>
      </div>
    );
  }

  // --- Error/Empty State ---
  if (!subscription) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <p className="text-lg font-semibold text-red-500">
          Could not load subscription plan.
        </p>
      </div>
    );
  }

  // --- Render Logic ---
  return (
    <div className="min-h-screen w-full bg-white text-left text-black font-sans">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <header className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 text-center mb-12">
          <h1 className="font-semibold text-3xl md:text-4xl text-zinc-900">
            Register - Store
          </h1>
          <p className="mt-2 text-base font-medium text-zinc-500">
            (No Contract, Cancel Anytime)
          </p>
        </header>

        {/* Main Content: Membership Cards */}
        <main className="flex flex-col items-center gap-12">
          {/* Verified Business Listing Card (Dynamic) */}
          <section className="w-full max-w-6xl rounded-lg bg-white border-2 border-solid border-blue-600 p-6 md:p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              BUSINESS PLAN
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
              {/* Left Side */}
              <div className="flex flex-col">
                <b className="text-lg text-blue-600">{subscription.name}</b>
                <p className="mt-2 text-base text-zinc-500">
                  {subscription.description}
                </p>
                <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">
                  ${parseFloat(subscription.price).toFixed(0)}/month
                </div>
                <p className="mt-1 text-sm text-zinc-500">Per location</p>
              </div>
              {/* Right Side */}
              <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                <h3 className="font-semibold text-base">Included Features:</h3>
                <ul className="mt-4 space-y-4 text-sm">
                  {/* Original detailed features can be re-added here if API features are supplementary */}
                  {subscription.features && subscription.features.length > 0 ? (
                    subscription.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckIcon />
                          <span className="flex-1">{feature}</span>
                        </li>
                      )
                    )
                  ) : (
                    <p className="text-zinc-500">
                      No features listed for this plan.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* Amplify Support Section */}
          {addons && addons.length > 0 && (
            <section className="w-full max-w-6xl text-center mt-8">
              <h2 className="font-semibold text-2xl md:text-3xl text-zinc-900">
                Amplify Your Support
              </h2>
              <p className="mt-2 text-base text-zinc-500 max-w-3xl mx-auto">
                Show the community what you stand for. 100% of these optional
                add-ons goes directly to community-voted advocacy funds.
              </p>
            </section>
          )}

          {/* Add-On Cards (Dynamic) */}
          <div
            className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 `}
          >
            {addons?.map((addon: any) => (
              <div
                key={addon.id}
                className="w-full rounded-lg bg-white border border-solid border-black p-6 flex flex-col"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <b className="text-lg text-zinc-800">{addon.name}</b>
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                      ADD-ON
                    </span>
                  </div>
                  <p className="mt-4 text-base text-zinc-600">
                    {addon.description}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <b className="text-2xl">
                    ${parseFloat(addon.price).toFixed(0)}/month
                  </b>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`addon-toggle-${addon.id}`}
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`addon-toggle-${addon.id}`}
                        className="sr-only peer"
                        checked={!!selectedAddons[addon.id]}
                        onChange={() => handleToggleAddon(addon.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600"></div>
                      <div className="absolute left-1 top-0.5 bg-white border-gray-300 border rounded-full h-5 w-5 transition-all peer-checked:translate-x-full peer-checked:border-white"></div>
                    </label>
                    <span className="font-medium text-sm">Activate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Action Buttons at the bottom */}
        <footer className="w-full max-w-md mx-auto mt-16 flex flex-col items-center gap-4 text-center">
          <button
            className={`w-full rounded bg-zinc-900 p-3 text-base font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors ${
              isSubscribing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onRegisterClick}
          >
            {isSubscribing ? "  Subscribeing..." : "  Subscribe"}
          </button>
          <div className="text-sm text-zinc-900">
            <span className="w-full">
              {`Already have an account? `}
              <a href="/login" className="underline hover:text-zinc-600">
                Sign in
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StoreSubscriptionPage;
