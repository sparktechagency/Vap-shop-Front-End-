'use client';

import { useGetallSubscribedUsersQuery, useUpdateSubscribetionStatusMutation } from '@/redux/features/store/SubscriptionApi';
import React, { useState, useEffect, FC, useMemo } from 'react';
import { toast } from 'sonner';

// --- TYPE DEFINITIONS ---
type InvoiceStatus = 'pending_invoice' | 'invoice_sent' | 'paid' | 'cancelled';
interface Subscription {
    id: number;
    name: string;
    email: string;
    plans: string;
    total: number;
    date: string;
    status: InvoiceStatus;
}
interface PlanDetail {
    id: number;
    name: string;
    type: string;
    badge: string | null;
    price: string;
}
interface User {
    id: number;
    full_name: string;
    email: string;
}
interface ApiSubscription {
    id: number;
    user_id: number;
    plan_details: PlanDetail[];
    total_cost: string;
    invoice_status: string;
    created_at: string;
    user: User;
}
interface ApiResponse {
    ok: boolean;
    message: string;
    data: {
        current_page: number;
        data: ApiSubscription[];
        last_page: number;
        total: number;
    };
}

// --- HELPER FUNCTIONS ---
const formatInvoiceStatus = (status: string): InvoiceStatus => {
    switch (status) {
        case 'pending_invoice': return 'pending_invoice';
        case 'invoice_sent': return 'invoice_sent';
        case 'paid': return 'paid';
        case 'cancelled': return 'cancelled';
        default: return 'pending_invoice';
    }
};

const formatPlans = (planDetails: PlanDetail[]): string => {
    if (!planDetails || planDetails.length === 0) return 'No plans selected';
    return planDetails
        .map(p => `${p.name} ($${parseFloat(p.price).toFixed(2)})`)
        .join(', ');
};

// --- UI COMPONENTS ---

const StatusBadge: FC<{ status: InvoiceStatus }> = ({ status }) => {
    const statusClasses: Record<InvoiceStatus, string> = {
        'pending_invoice': 'bg-yellow-100 text-yellow-800',
        'invoice_sent': 'bg-blue-100 text-blue-800',
        'paid': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const InvoiceModal: FC<{ isOpen: boolean; onClose: () => void; onUpdateStatus: (id: number, newStatus: InvoiceStatus) => void; subscription: Subscription | null; }> = ({ isOpen, onClose, onUpdateStatus, subscription }) => {
    const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>('pending_invoice');

    useEffect(() => {
        if (subscription) {
            setCurrentStatus(subscription.status);
        }
    }, [subscription]);

    // This condition correctly hides the modal when not in use
    if (!isOpen || !subscription) {
        return null;
    }

    const handleUpdate = () => {
        onUpdateStatus(subscription.id, currentStatus);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-transform duration-300 scale-100">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Invoice Details</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-800">User Information</h4>
                        <p className="text-sm text-gray-600"><strong>Name:</strong> {subscription.name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {subscription.email}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Subscription Details</h4>
                        <p className="text-sm text-gray-600"><strong>Selected Plans:</strong> {subscription.plans}</p>
                        <p className="text-lg font-bold text-black"><strong>Total Amount:</strong> ${subscription.total.toFixed(2)}</p>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-sm text-yellow-700">
                            <strong>Admin Action: </strong>Please log in to the Authorize.net dashboard and send an invoice of <strong>${subscription.total.toFixed(2)}</strong> to this user's email. Once the payment is received, update the status below accordingly.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="status-update" className="block text-sm font-medium text-gray-700">Update Invoice Status</label>
                        <select
                            id="status-update"
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value as InvoiceStatus)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option>pending_invoice</option>
                            <option>invoice_sent</option>
                            <option>paid</option>
                            <option>cancelled</option>
                        </select>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onClick={handleUpdate} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white cursor-pointer focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Update & Save
                    </button>
                    <button type="button" onClick={onClose} className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const Pagination: FC<{ currentPage: number; lastPage: number; setCurrentPage: (page: number) => void; siblingCount?: number; }> = ({ currentPage, lastPage, setCurrentPage, siblingCount = 1 }) => {
    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;
        if (totalPageNumbers >= lastPage) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < lastPage - 2;
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', lastPage];
        }
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => lastPage - rightItemCount + 1 + i);
            return [1, '...', ...rightRange];
        }
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [1, '...', ...middleRange, '...', lastPage];
        }
        return [];
    }, [currentPage, lastPage, siblingCount]);

    if (currentPage === 0 || paginationRange.length < 2) return null;

    return (
        <div className="flex items-center justify-between mt-6">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <nav><ul className="flex items-center space-x-1">
                {paginationRange.map((page, index) => (
                    <li key={page === '...' ? `ellipsis-${index}` : page}>
                        {page === '...' ? (
                            <span className="px-4 py-2 text-sm text-gray-500">...</span>
                        ) : (
                            <button onClick={() => setCurrentPage(page as number)} className={`px-4 py-2 text-sm font-medium rounded-md ${page === currentPage ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>{page}</button>
                        )}
                    </li>
                ))}
            </ul></nav>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === lastPage} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const SubscriptionsManagement: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: apiResponse, isLoading, isError, refetch } = useGetallSubscribedUsersQuery({ page: currentPage });
    const [updateSubscriptionStatus, { isLoading: isUpdating }] = useUpdateSubscribetionStatusMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    const subscriptions: Subscription[] = useMemo(() => {
        return apiResponse?.data?.data.map((sub: ApiSubscription) => ({
            id: sub.id,
            name: sub.user.full_name,
            email: sub.user.email,
            plans: formatPlans(sub.plan_details),
            total: parseFloat(sub.total_cost),
            date: new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            status: formatInvoiceStatus(sub.invoice_status),
        })) ?? [];
    }, [apiResponse]);

    const pendingCount = useMemo(() => subscriptions.filter(s => s.status === 'pending_invoice').length, [subscriptions]);

    const handleOpenModal = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubscription(null);
    };

    const handleUpdateStatus = async (id: number, newStatus: InvoiceStatus) => {
        const formData = {
            status: newStatus,
            _method: 'PUT',
        }

        try {

            const response = await updateSubscriptionStatus({ id, formData }).unwrap();
            console.log('response', response);

            if (response.ok) {
                toast.success(response.message || "Status updated successfully");
                handleCloseModal();
                refetch();
            }

        } catch (error) {

            console.log('error', error);


        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading subscriptions...</div></div>;
    if (isError || !apiResponse?.ok) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold text-red-600">Failed to load data. Please try again.</div></div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Subscriptions & Billing</h1>
                            <p className="text-gray-500 mt-1">Manage new subscription requests and billing.</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                                {pendingCount} pending_invoices
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Plans</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subscriptions.length > 0 ? subscriptions.map((sub) => (
                                    <tr key={sub.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{sub.name}</div><div className="text-sm text-gray-500">{sub.email}</div></td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">{sub.plans}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${sub.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={sub.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleOpenModal(sub)} className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition-colors">Details / Manage</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No subscription requests found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {apiResponse?.data && (
                        <Pagination currentPage={apiResponse.data.current_page} lastPage={apiResponse.data.last_page} setCurrentPage={setCurrentPage} />
                    )}
                </div>
            </div>
            {/* The modal is rendered here, and its visibility is handled internally by its `isOpen` prop */}
            <InvoiceModal isOpen={isModalOpen} onClose={handleCloseModal} onUpdateStatus={handleUpdateStatus} subscription={selectedSubscription} />
        </div>
    );
};

export default SubscriptionsManagement;