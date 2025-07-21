// 'use client';

// import { useState, useEffect } from 'react';
// import { useGetOwnprofileQuery } from '@/redux/features/AuthApi';
// import StoreSubscriptionPage from '@/app/(auth)/(subscriptions)/storesubscription/page';
// import { X } from 'lucide-react'; 
// import WholesalerPage from '@/app/(auth)/(subscriptions)/wholesalersubscription/page';
// import Membersubscriptionpackage from '@/app/(auth)/(subscriptions)/membersubscriptionpackage/page';
// import Cookies from 'js-cookie';
// export default function SubscriptionModal() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const { data: userProfile } = useGetOwnprofileQuery(undefined);
//     const user = userProfile?.data;
//     const token = Cookies.get("token");
//     console.log('user', user);

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };
//     useEffect(() => {
//         if (user && token) {

//             const shouldShowModal = user.is_subscribed === false || user.role !== 1 && user.role !== 2 && user.role !== 6;
//             setIsModalOpen(shouldShowModal);
//         } else {

//             setIsModalOpen(false);
//         }
//     }, [user]);
//     if (!isModalOpen) return null;
//     return (

//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">


//             <div className="flex h-full max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">


//                 <header className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//                         Choose Your Plan
//                     </h2>
//                     {user?.role_label === "Member" && (
//                         <button
//                             onClick={handleCloseModal}
//                             className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
//                             aria-label="Close modal"
//                         >
//                             <X size={24} />
//                         </button>
//                     )}
//                 </header>




//                 <main className="flex-grow overflow-y-auto p-2 sm:p-6 w-full">
//                     {
//                         user.role_label === "Member" && <Membersubscriptionpackage />
//                     }
//                     {
//                         user.role_label === "Store" && <StoreSubscriptionPage />
//                     }
//                     {
//                         user.role_label === "Wholesaler" && <WholesalerPage />
//                     }
//                 </main>

//             </div>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { useGetOwnprofileQuery } from '@/redux/features/AuthApi';
import StoreSubscriptionPage from '@/app/(view)/subscription/storesubscription/page';
import WholesalerPage from '@/app/(view)/subscription/wholesalersubscription/page';
import Membersubscriptionpackage from '@/app/(view)/subscription/membersubscriptionpackage/page';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';

export default function SubscriptionModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: userProfile } = useGetOwnprofileQuery(undefined);
    const user = userProfile?.data;
    const token = Cookies.get("token");

    /**
     * মোডাল বন্ধ করার ফাংশন।
     * এটি sessionStorage-এ একটি ফ্ল্যাগ সেট করে যাতে রিলোডের পর মোডালটি আবার না আসে।
     */
    const handleCloseModal = () => {
        sessionStorage.setItem('subscriptionModalDismissed', 'true');
        setIsModalOpen(false);
    };

    useEffect(() => {
        // sessionStorage থেকে চেক করা হচ্ছে ব্যবহারকারী আগে মোডালটি বন্ধ করেছে কি না।
        const hasDismissedModal = sessionStorage.getItem('subscriptionModalDismissed') === 'true';

        // যদি ব্যবহারকারী লগইন করা থাকে এবং আগে মোডাল বন্ধ না করে থাকে
        if (user && token && !hasDismissedModal) {
            // ✅ সঠিক লজিক: রোল যদি 1, 2, বা 6 না হয় এবং সাবস্ক্রিপশনও না থাকে
            const shouldShowModal = ![1, 2, 6].includes(user.role) && user.is_subscribed === false;
            setIsModalOpen(shouldShowModal);
        } else {
            // অন্য সব ক্ষেত্রে মোডাল বন্ধ থাকবে
            setIsModalOpen(false);
        }
    }, [user, token]); // user অথবা token পরিবর্তন হলে এই কোড আবার চলবে

    // যদি মোডাল দেখানোর প্রয়োজন না হয়, তাহলে কিছুই রেন্ডার হবে না
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="flex h-full max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                <header className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Choose Your Plan
                    </h2>

                    {/* ব্যবহারকারীর রোল 'Member' হলেই শুধুমাত্র ক্লোজ বাটনটি দেখা যাবে */}
                    {user?.role_label === "Member" && (
                        <button
                            onClick={handleCloseModal}
                            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    )}
                </header>

                <main className="flex-grow overflow-y-auto p-2 sm:p-6 w-full">
                    {/* ব্যবহারকারীর রোলের উপর ভিত্তি করে সঠিক সাবস্ক্রিপশন পেইজ দেখানো হচ্ছে */}
                    {user?.role_label === "Member" && <Membersubscriptionpackage />}
                    {user?.role_label === "Store" && <StoreSubscriptionPage />}
                    {user?.role_label === "Wholesaler" && <WholesalerPage />}
                </main>
            </div>
        </div>
    );
}