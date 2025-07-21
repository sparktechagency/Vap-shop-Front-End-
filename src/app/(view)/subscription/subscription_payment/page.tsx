

"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { usePurchesSubscriptionMutation } from "@/redux/features/store/SubscriptionApi"

//=================================================================
// 1. Zod Validation Schema
//=================================================================
const formSchema = z.object({
    cardName: z.string().min(2, {
        message: "Cardholder name must be at least 2 characters.",
    }),
    cardNumber: z.string().regex(/^\d{16}$/, {
        message: "Card number must be exactly 16 digits.",
    }),
    expiryDate: z.string()
        .regex(/^(0[1-9]|1[0-2])\s?\/\s?(\d{2})$/, {
            message: "Invalid date format. Please use MM/YY.",
        })
        .refine((val) => {
            const [month, year] = val.split('/').map(s => s.trim());
            const expiry = new Date(parseInt(`20${year}`), parseInt(month));
            const now = new Date();
            return expiry >= new Date(now.getFullYear(), now.getMonth(), 1);
        }, {
            message: "Card has expired.",
        }),
    cvc: z.string().regex(/^\d{3,4}$/, {
        message: "CVC must be 3 or 4 digits.",
    }),
});

//=================================================================
// 2. Animated Success Modal Component
//=================================================================
const PremiumSuccessModal = () => {
    const router = useRouter();

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { scale: 0.8, opacity: 0, y: 30 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            y: 30,
            transition: { duration: 0.2 }
        }
    };

    const handleRedirect = () => {
        router.push("/subscription");
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div
                className="bg-background rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border"
                variants={modalVariants}
            >
                <motion.div
                    className="flex justify-center mb-5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.3, type: "spring" } }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-20 h-20 text-green-500">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
                    className="text-2xl font-bold text-foreground mb-2"
                >
                    Welcome Aboard!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
                    className="text-muted-foreground mb-8"
                >
                    Your subscription is confirmed. You now have full premium access.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
                >
                    <Button onClick={handleRedirect} className="w-full h-11 text-base">
                        Continue
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

//=================================================================
// 3. Main Payment Page Component
//=================================================================
export default function ZodOnlyPaymentPage() {
    const searchParams = useSearchParams();
    const planId = searchParams.get('planid');
    const [purchesSubscription, { isLoading }] = usePurchesSubscriptionMutation();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { cardName: "", cardNumber: "", expiryDate: "", cvc: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const [expMonth, expYear] = values.expiryDate.split('/').map(s => s.trim());
        const submissionData = {
            plan_id: planId ? parseInt(planId, 10) : null,
            card_details: {
                card_number: values.cardNumber,
                expiration_month: parseInt(expMonth, 10),
                expiration_year: parseInt(`20${expYear}`, 10),
                cvc: values.cvc
            }
        };

        try {
            await purchesSubscription(submissionData).unwrap();
            setShowSuccessModal(true); // Show modal on success
        } catch (error: any) {
            console.error("Payment Failed:", error);
            toast.error(error?.data?.message || "Payment Failed");
        }
    }

    return (
        <>
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Secure Payment</CardTitle>
                        <CardDescription>Enter your payment details below. Format must be exact.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="cardName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cardholder Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cardNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Card Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1111222233334444" {...field} inputMode="numeric" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="expiryDate"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel>Expiry Date</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="MM/YY" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cvc"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel>CVC</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123" {...field} inputMode="numeric" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11 text-base" disabled={!planId || isLoading}>
                                    {isLoading ? 'Processing Payment...' : 'Pay and Subscribe'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <AnimatePresence>
                {showSuccessModal && <PremiumSuccessModal />}
            </AnimatePresence>
        </>
    )
}