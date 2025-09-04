

'use client';

import type { NextPage } from 'next';
import { useCallback, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetmemberAdonsQuery, useGetSubscriptionDetailsQuery, useSendSubscriptionToAdminMutation } from '@/redux/features/store/SubscriptionApi';
import { toast } from 'sonner';

// A simple SVG for checkmarks
const CheckIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="12" height="12" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 mt-1">
        <path d="M8.33329 2.5L3.74996 7.08333L1.66663 5" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Membersubscriptionpackage: NextPage = () => {
    // --- State and Data Fetching ---
    const router = useRouter();
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [isAddonActive, setAddonActive] = useState(false);
    const [sendSubscriptionToAdmin, { isLoading: isSubscribing }] = useSendSubscriptionToAdminMutation();

    // Fetch dynamic data for paid plans and add-ons
    const { data: subscriptionDetails, isLoading: isLoadingSubscription, error, refetch } = useGetSubscriptionDetailsQuery({ type: "member" });
    const { data: memberAdons, isLoading: isLoadingAdons } = useGetmemberAdonsQuery();
    console.log('subscriptionDetails', subscriptionDetails);

    // --- Memoized Data Extraction ---
    const { paidPlan, freePlan } = useMemo(() => {
        const plans = subscriptionDetails?.data || [];
        const paid = plans?.find((plan: any) => parseFloat(plan.price) > 0);
        const free = plans?.find((plan: any) => parseFloat(plan.price) === 0);
        return { paidPlan: paid, freePlan: free };
    }, [subscriptionDetails]);

    const hempAddon = memberAdons?.data?.[0];

    // --- Event Handlers ---
    const handleSelectPlan = (planId: number | null) => {
        setSelectedPlanId(planId);
        // Deactivate addon if a non-paid plan is selected
        if (planId !== paidPlan?.id) {
            setAddonActive(false);
        }
    };

    const handleToggleAddon = () => {
        // Only allow activating the addon if the paid plan is selected
        if (selectedPlanId === paidPlan?.id) {
            setAddonActive(prev => !prev);
        }
    };

    const onSubscribeClick = useCallback(async () => {
        if (selectedPlanId === null) {
            toast.error("Please select a membership plan.");
            return;
        }

        const plan_ids = [selectedPlanId];
        const isPaidPlanSelected = selectedPlanId === paidPlan?.id;

        if (isAddonActive && isPaidPlanSelected && hempAddon?.id) {
            plan_ids.push(hempAddon.id);
        }

        try {
            const response = await sendSubscriptionToAdmin({ plan_ids }).unwrap();
            if (response?.ok) {
                toast.success(response?.message || "Subscribed successfully");
                refetch();
                // Optionally redirect user after successful subscription
                // router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Subscription error:', error);
            toast.error(error?.data?.message || 'Failed to Subscribe');
        }
    }, [selectedPlanId, isAddonActive, paidPlan, hempAddon, sendSubscriptionToAdmin, refetch, router]);

    // --- Loading and Error States ---
    const isLoading = isLoadingSubscription || isLoadingAdons;
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <p className="text-lg font-semibold">Loading Memberships...</p>
            </div>
        );
    }



    const isPaidPlanSelected = selectedPlanId === paidPlan?.id;

    // --- Render Logic ---
    return (
        <div className="min-h-screen w-full bg-white text-left text-black font-sans">
            <div className="container mx-auto px-4 py-8 md:py-16">

                {/* Header Section */}
                <header className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 text-center mb-12">
                    <h1 className="font-semibold text-3xl md:text-4xl text-zinc-900">Register - Member</h1>
                    <p className="mt-2 text-base font-medium text-zinc-500">Choose Your Membership</p>
                </header>

                {/* Main Content: Membership Cards */}
                <main className="flex flex-col items-center gap-8">

                    {/* Free Membership Card (Dynamic) */}
                    {paidPlan && <section className={`w-full max-w-6xl rounded-lg bg-white p-6 md:p-8 transition-all border-2 ${selectedPlanId === freePlan.id ? 'border-green-600' : 'border-black border-solid'}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                            <div className="flex flex-col">
                                <b className="text-lg text-green-600">{freePlan?.name}</b>
                                <p className="mt-2 text-base text-zinc-500">{freePlan.description}</p>
                                <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">${parseFloat(freePlan.price).toFixed(0)}/month</div>
                                <div className="mt-auto pt-6 text-sm">
                                    <p className="m-0"><b>Badge: </b><span className="text-zinc-500">{freePlan.badge}</span></p>
                                    <p className="m-0 mt-1"><b>Discounts/Perks: </b><span>Full access to platform features</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                                <h3 className="font-semibold text-base">What's Included:</h3>
                                <ul className="mt-4 space-y-3 text-sm">
                                    {
                                        freePlan.features.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckIcon />
                                                <span className="flex-1">{feature}</span>
                                            </li>
                                        ))
                                    }

                                </ul>
                                <div className="mt-auto pt-6 flex justify-end">
                                    <button
                                        className={`w-full sm:w-auto rounded px-6 py-2 font-medium text-sm cursor-pointer transition-colors ${selectedPlanId === freePlan.id ? 'bg-green-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}
                                        onClick={() => handleSelectPlan(freePlan.id)}
                                    >
                                        {selectedPlanId === freePlan.id ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    }
                    {/* Paid Membership Card (Dynamic) */}
                    {
                        paidPlan && <section className={`w-full max-w-6xl rounded-lg bg-white p-6 md:p-8 relative transition-all border-2 ${isPaidPlanSelected ? 'border-purple-600' : 'border-black border-solid'}`}>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col">
                                    <b className="text-lg text-purple-600">{paidPlan.name}</b>
                                    <p className="mt-2 text-base text-zinc-500">{paidPlan.description}</p>
                                    <div className={`mt-4 text-4xl md:text-6xl font-semibold ${isPaidPlanSelected ? 'text-purple-600' : 'text-black'}`}>${parseFloat(paidPlan.price).toFixed(0)}/month</div>
                                    <div className="mt-auto pt-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <b>Badge:</b>
                                            <div className="rounded-full bg-gradient-to-r from-[#6941C6] to-[#A583F4] px-3 py-0.5 text-white flex items-center justify-center">
                                                <b className="text-xs">{paidPlan.badge}</b>
                                            </div>
                                        </div>
                                        <p className="m-0 mt-2"><b>Discounts/Perks: </b><span>Real-world savings, voting power, and visibility</span></p>
                                    </div>
                                </div>
                                <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                                    <h3 className="font-semibold text-base">Member-Only Perks:</h3>
                                    <ul className="mt-4 space-y-3 text-sm">
                                        {
                                            freePlan.features.map((feature: string, index: number) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckIcon />
                                                    <span className="flex-1">{feature}</span>
                                                </li>
                                            ))
                                        }

                                    </ul>
                                    <div className="mt-auto pt-6 flex justify-end">
                                        <button
                                            className={`w-full sm:w-auto rounded px-6 py-2 font-medium text-sm cursor-pointer transition-colors ${isPaidPlanSelected ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}
                                            onClick={() => handleSelectPlan(paidPlan.id)}
                                        >
                                            {isPaidPlanSelected ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }


                    {
                        hempAddon && <section className={`w-full max-w-6xl rounded-lg bg-white p-6 md:p-8 transition-opacity ${isPaidPlanSelected ? 'opacity-100 border-black border' : 'opacity-50 bg-gray-50 border-gray-200 border'}`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <b className="text-lg text-teal-800">{hempAddon.name}</b>
                                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">ADD-ON</span>
                                    </div>
                                    <p className="mt-2 text-base text-zinc-500">{hempAddon.description}</p>
                                    <p className="mt-4 text-sm text-zinc-600"><b>Eligibility: </b><span>Must be an active Core Club Member</span></p>
                                    <div className="mt-2 flex items-center gap-2 text-sm">
                                        <b>Badge: </b>
                                        <div className="rounded-full bg-gradient-to-r from-[#0C7953] to-[#15DF99] px-3 py-0.5 text-white flex items-center justify-center">
                                            <b className="text-xs">{hempAddon.badge} Supporter</b>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end flex-shrink-0 mt-4 md:mt-0">
                                    <b className="text-3xl md:text-4xl">${parseFloat(hempAddon.price).toFixed(0)}/month</b>
                                    <div className="mt-4 flex items-center gap-3">
                                        <label htmlFor="activate-toggle" className={`relative inline-flex items-center ${isPaidPlanSelected ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                            <input
                                                type="checkbox"
                                                id="activate-toggle"
                                                className="sr-only peer"
                                                checked={isAddonActive}
                                                onChange={handleToggleAddon}
                                                disabled={!isPaidPlanSelected}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:bg-teal-600"></div>
                                            <div className="absolute left-1 top-0.5 bg-white border-gray-300 border rounded-full h-5 w-5 transition-all peer-checked:translate-x-full peer-checked:border-white"></div>
                                        </label>
                                        <span className="font-medium text-sm">Activate</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }

                </main>

                {/* Action Button at the bottom */}
                <footer className="w-full max-w-md mx-auto mt-16 flex flex-col items-center gap-4 text-center">
                    <button
                        className="w-full rounded bg-zinc-900 p-3 text-base font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={onSubscribeClick}
                        disabled={selectedPlanId === null || isSubscribing}
                    >
                        {isSubscribing ? 'Processing...' : (selectedPlanId === freePlan?.id ? 'Complete Registration' : 'Continue to Payment')}
                    </button>
                    <div className="text-sm text-zinc-900">
                        <span>{`Already have an account? `}<a href="/login" className="underline hover:text-zinc-600">Sign in</a></span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Membersubscriptionpackage;

