'use client';

import { useBrandAdonsQuery, useGetSubscriptionDetailsQuery, useSendSubscriptionToAdminMutation } from '@/redux/features/store/SubscriptionApi';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// A simple SVG for checkmarks, used in feature lists
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 mt-1">
        <path d="M8.33329 2.5L3.74996 7.08333L1.66663 5" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const BrandSubscriptionPage: NextPage = () => {
    // --- State and Data Fetching ---
    const router = useRouter();
    const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

    // Fetch dynamic data for the plan and add-ons
    const { data: subscriptionDetails, isLoading: isLoadingSubscription, refetch } = useGetSubscriptionDetailsQuery({ type: "brand" });
    const { data: brandAdons, isLoading: isLoadingAdons } = useBrandAdonsQuery();
    const [sendSubscriptionToAdmin] = useSendSubscriptionToAdminMutation();
    // --- Memoized Data Extraction ---
    const plan = subscriptionDetails?.data?.[0];
    const addons = brandAdons?.data;

    // --- Event Handlers ---
    const handleToggleAddon = (addonId: number) => {
        setSelectedAddons(prev => ({
            ...prev,
            [addonId]: !prev[addonId]
        }));
    };

    const onRegisterClick = useCallback(async () => {
        if (!plan) return;

        const selectedAddonIds = Object.entries(selectedAddons)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => Number(id)); // convert IDs to numbers if needed

        const plan_ids = [plan.id, ...selectedAddonIds];

        console.log('plan_ids', plan_ids);

        try {
            const response = await sendSubscriptionToAdmin({ plan_ids }).unwrap();
            console.log('response', response);

            if (response.ok) {
                toast.success(response.message || "Subscribed successfully");
                // Optionally refetch or navigate
                refetch();

            }
        } catch (error: any) {
            console.error('error', error);
            toast.error(error?.data?.message || 'Failed to Subscribe');
        }
    }, [plan, selectedAddons, sendSubscriptionToAdmin, router]);

    // --- Loading and Error States ---
    const isLoading = isLoadingSubscription || isLoadingAdons;
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <p className="text-lg font-semibold">Loading Brand Plan...</p>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <p className="text-lg font-semibold text-red-500">Could not load the Brand plan.</p>
            </div>
        );
    }

    // --- Render Logic ---
    return (
        <div className="min-h-screen w-full bg-white text-left text-black font-sans">
            <div className="container mx-auto px-4 py-8 md:py-16">

                {/* Header Section */}
                <header className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 text-center mb-12">
                    <h1 className="font-semibold text-3xl md:text-4xl text-zinc-900">Register - Brand</h1>
                    <p className="mt-2 text-base font-medium text-zinc-500">Claim your Brand account</p>
                </header>

                {/* Main Content: Membership Cards */}
                <main className="flex flex-col items-center gap-12">

                    {/* Core Brand Subscription Card (Dynamic) */}
                    <section className="w-full max-w-6xl rounded-lg bg-white border-2 border-solid border-blue-600 p-6 md:p-8 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">BRAND PLAN</div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                            {/* Left Side */}
                            <div className="flex flex-col">
                                <b className="text-lg text-blue-600">{plan.name}</b>
                                <p className="mt-2 text-base text-zinc-500">{plan.description}</p>
                                <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">${parseFloat(plan.price).toFixed(0)}/month</div>
                                <div className="mt-auto pt-6">
                                    <b className="text-base text-zinc-700">Beta Price – No Contracts</b>
                                </div>
                            </div>
                            {/* Right Side */}
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                                <div className="space-y-6">
                                    {plan.features && plan.features.length > 0 ? (
                                        <div>
                                            <h3 className="font-semibold text-base">🧾 Core Features for Brands</h3>
                                            <ul className="mt-3 space-y-3 text-sm">
                                                {plan.features.map((feature: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <CheckIcon />
                                                        <span className="flex-1">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Fallback to original detailed content if API features are empty */}
                                            <div>
                                                <h3 className="font-semibold text-base">🧾 Core Features for Brands</h3>
                                                <ul className="mt-3 space-y-3 text-sm">
                                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1"><b>Full Brand Profile Page:</b> Showcase your story, catalog, media, and connected brands</span></li>
                                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1"><b>Product Listings:</b> Organized by category (disposables, e-liquids, hardware, etc.)</span></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base">📈 Marketing & Promotional Opportunities</h3>
                                                <ul className="mt-3 space-y-3 text-sm">
                                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1"><b>Trending Placement Eligibility:</b> Appear in “Most Hearted” sections based on engagement</span></li>
                                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1"><b>Featured Product Promotions:</b> Spotlight new drops or events</span></li>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Amplify Support Section */}
                    {addons && addons.length > 0 && (
                        <section className="w-full max-w-6xl text-center mt-8">
                            <h2 className="font-semibold text-2xl md:text-3xl text-zinc-900">Amplify Your Support</h2>
                            <p className="mt-2 text-base text-zinc-500 max-w-3xl mx-auto">Show the community what you stand for. 100% of these optional add-ons goes directly to community-voted advocacy funds.</p>
                        </section>
                    )}

                    {/* Add-On Cards (Dynamic) */}
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                        {addons?.map((addon: any) => (
                            <div key={addon.id} className="w-full rounded-lg bg-white border border-solid border-black p-6 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <b className="text-lg text-teal-800">{addon.name}</b>
                                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">ADD-ON</span>
                                    </div>
                                    <p className="mt-4 text-base text-zinc-600">{addon.description}</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                                    <b className="text-2xl">${parseFloat(addon.price).toFixed(0)}/month</b>
                                    <div className="flex items-center gap-3">
                                        <label htmlFor={`addon-toggle-${addon.id}`} className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id={`addon-toggle-${addon.id}`}
                                                className="sr-only peer"
                                                checked={!!selectedAddons[addon.id]}
                                                onChange={() => handleToggleAddon(addon.id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:bg-teal-600"></div>
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
                    <button className="w-full rounded bg-zinc-900 p-3 text-base font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors" onClick={onRegisterClick}>
                        Subscribe
                    </button>
                    <div className="text-sm text-zinc-900">
                        <span className="w-full">
                            {`Already have an account? `}
                            <a href="/login" className="underline hover:text-zinc-600">Sign in</a>
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default BrandSubscriptionPage;