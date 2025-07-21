'use client';

import type { NextPage } from 'next';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
// A simple SVG to replace the original Image component for checkmarks
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 mt-1">
        <path d="M8.33329 2.5L3.74996 7.08333L1.66663 5" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const Membersubscriptionpackage: NextPage = () => {
    const router = useRouter();
    const onButtonsPrimaryContainerClick = useCallback(() => {
        router.push("/subscription/subscription_payment?planid=5");
        // Add your code here
        console.log("Register or Select button clicked");
    }, []);

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

                    {/* Free Membership Card */}
                    <section className="w-full max-w-6xl rounded-lg bg-white border border-solid border-black p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                            {/* Left Side */}
                            <div className="flex flex-col">
                                <b className="text-lg text-green-600">Free Membership</b>
                                <p className="mt-2 text-base text-zinc-500">Perfect for new users who want to explore the full platform at no cost.</p>
                                <div className="mt-4 text-4xl md:text-6xl font-semibold text-black">$0/month</div>
                                <div className="mt-auto pt-6 text-sm">
                                    <p className="m-0">
                                        <b>{`Badge: `}</b>
                                        <span className="text-zinc-500">None</span>
                                    </p>
                                    <p className="m-0 mt-1">
                                        <b>{`Discounts/Perks: `}</b>
                                        <span>Full access to platform features</span>
                                    </p>
                                </div>
                            </div>
                            {/* Right Side */}
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                                <h3 className="font-semibold text-base">What's Included:</h3>
                                <ul className="mt-4 space-y-3 text-sm">
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Join discussions, write reviews, and share product tips</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Follow stores, brands, and advocacy groups for updates</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Discover shops and products worldwide</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Place online order requests for free — no payment is made on the platform; all transactions occur at the store</span></li>
                                </ul>
                                <div className="mt-auto pt-6 flex justify-end">
                                    <button className="w-full sm:w-auto rounded bg-zinc-900 px-6 py-2 text-white font-medium text-sm cursor-pointer hover:bg-zinc-700 transition-colors" onClick={onButtonsPrimaryContainerClick}>
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Club Membership Card */}
                    <section className="w-full max-w-6xl rounded-lg bg-white border-2 border-solid border-purple-600 p-6 md:p-8 relative opacity-50 pointer-events-none">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
                            {/* Left Side */}
                            <div className="flex flex-col">
                                <b className="text-lg text-purple-600">Core Club Membership</b>
                                <p className="mt-2 text-base text-zinc-500">Ideal for users who want exclusive perks while supporting platform development and growth.</p>
                                <div className="mt-4 text-4xl md:text-6xl font-semibold text-purple-600">$6/month</div>
                                <div className="mt-auto pt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <b>Badge:</b>
                                        <div className="rounded-full bg-gradient-to-r from-[#6941C6] to-[#A583F4] px-3 py-0.5 text-white flex items-center justify-center">
                                            <b className="text-xs">Core Club</b>
                                        </div>
                                    </div>
                                    <p className="m-0 mt-2">
                                        <b>{`Discounts/Perks: `}</b>
                                        <span>Real-world savings, voting power, and visibility</span>
                                    </p>
                                </div>
                            </div>
                            {/* Right Side */}
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
                                <h3 className="font-semibold text-base">Your Membership Supports:</h3>
                                <ul className="mt-4 space-y-3 text-sm">
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Platform maintenance</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">New feature development</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Transparency and user engagement tools</span></li>
                                </ul>
                                <h3 className="font-semibold text-base mt-6">Member-Only Perks:</h3>
                                <ul className="mt-4 space-y-3 text-sm">
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">10% permanent discount at participating vape shops</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">50% off tickets to all Vape Shop Maps–hosted events</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">Early-access voting on new features and platform decisions</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon /><span className="flex-1">A visible “Core Club” badge across your profile and content</span></li>
                                </ul>
                                <div className="mt-auto pt-6 flex justify-end">
                                    <button className="w-full sm:w-auto rounded bg-purple-600 px-6 py-2 text-white font-medium text-sm cursor-pointer hover:bg-purple-700 transition-colors" onClick={onButtonsPrimaryContainerClick}>
                                        Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Hemp Advocacy Add-On Card */}
                    <section className="w-full max-w-6xl rounded-lg bg-white border border-solid border-black p-6 md:p-8 opacity-50 pointer-events-none">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <b className="text-lg text-teal-800">Hemp Advocacy Add-On</b>
                                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">ADD-ON</span>
                                </div>
                                <p className="mt-2 text-base text-zinc-500">Show your support for hemp-specific advocacy efforts.</p>
                                <p className="mt-4 text-sm text-zinc-600">
                                    <b>{`Eligibility: `}</b>
                                    <span>Must be an active Core Club Member</span>
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <b>{`Badge: `}</b>
                                    <div className="rounded-full bg-gradient-to-r from-[#0C7953] to-[#15DF99] px-3 py-0.5 text-white flex items-center justify-center">
                                        <b className="text-xs">Hemp Advocacy Supporter</b>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end flex-shrink-0 mt-4 md:mt-0">
                                <b className="text-3xl md:text-4xl">$3/month</b>
                                <div className="mt-4 flex items-center gap-3">
                                    <label htmlFor="activate-toggle" className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" id="activate-toggle" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:bg-teal-600"></div>
                                        <div className="absolute left-1 top-0.5 bg-white border-gray-300 border rounded-full h-5 w-5 transition-all peer-checked:translate-x-full peer-checked:border-white"></div>
                                    </label>
                                    <span className="font-medium text-sm">Activate</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Action Buttons at the bottom */}
                <footer className="w-full max-w-md mx-auto mt-16 flex flex-col items-center gap-4 text-center">
                    <button className="w-full rounded bg-zinc-900 p-3 text-base font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors" onClick={onButtonsPrimaryContainerClick}>
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

export default Membersubscriptionpackage;
