'use client';

import React, { useState, useEffect } from 'react';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { toast } from 'sonner';
import { useAdmintermsConditionsMutation, useGettermspagesQuery } from '@/redux/features/admin/AdminApis';

// A simple loading spinner component for better UX
const Spinner = () => (
    <div className="flex justify-center items-center h-full" aria-label="Loading content">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);

// The list of policies is static and used for navigation.
const policyNavigationItems = [
    { id: 'privacy-policy', title: 'Privacy Policy' },
    { id: 'terms-of-service', title: 'Terms of Service' },
    { id: 'vape-&-age-restriction-policy', title: 'Vape & Age Restriction Policy' },
    { id: 'brand', title: 'Liability & Store/Brand' },
    { id: 'content-&-review-moderation-policy', title: 'Content & Review Moderation Policy' },
    { id: 'dmca-copyright', title: 'DMCA Copyright' },
    { id: 'community-guidelines', title: 'Community Guidelines' },
    { id: 'acceptance-of-terms', title: 'Acceptance of Terms' },
];

// Main Page Component - Now handles all logic
export default function AdminPolicyPage() {
    const [activePolicyId, setActivePolicyId] = useState<string>(policyNavigationItems[0].id);
    const [content, setContent] = useState<string>('');

    // 1. Data fetching is now centralized in the main component.
    // The query automatically re-fetches when `activePolicyId` changes.
    const { data: pageData, isLoading, refetch } = useGettermspagesQuery({ type: activePolicyId });

    // 2. The mutation hook for saving data.
    const [admintermsConditions, { isLoading: isSaving }] = useAdmintermsConditionsMutation();

    // 3. This useEffect synchronizes the fetched data with our local editor state.
    // It runs only when the fetched data or the active policy ID changes.
    useEffect(() => {
        if (pageData?.ok && pageData.data?.content) {
            setContent(pageData.data.content);
        } else {
            // Set a default value if there's no content from the API
            setContent('');
        }
    }, [pageData, activePolicyId]);

    // 4. The save handler is now cleaner. It uses the component's state directly.
    const handleSave = async () => {
        if (!activePolicyId) return;

        const body = {
            type: activePolicyId,
            content: content
        };

        try {
            const response = await admintermsConditions({ body }).unwrap();
            if (response?.ok) {
                toast.success('Content saved successfully!');
                // Optional: refetch the data to ensure UI is in sync with the server
                refetch();
            } else {
                toast.error(response?.message || 'Failed to save policy.');
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'An error occurred while saving.');
        }
    };

    // Header template for the PrimeReact Editor
    const editorHeader = (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-strike" aria-label="Strike"></button>
            <button className="ql-link" aria-label="Link"></button>
            <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
            <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
            <select className="ql-header" defaultValue="0" aria-label="Font Size">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="0">Normal</option>
            </select>
        </span>
    );

    const activePolicy = policyNavigationItems.find(p => p.id === activePolicyId);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Left-side Navigation */}
            <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Policy Pages</h2>
                <nav>
                    <ul>
                        {policyNavigationItems.map(policy => (
                            <li key={policy.id} className="mb-2">
                                <button
                                    onClick={() => setActivePolicyId(policy.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activePolicyId === policy.id
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    {policy.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Right-side Content and Editor */}
            <main className="flex-1 p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{activePolicy?.title}</h1>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className="px-6 py-2 bg-black text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Content'}
                        </button>
                    </div>

                    {isLoading ? (
                        <div style={{ height: '500px' }}><Spinner /></div>
                    )
                        : (
                            <Editor
                                value={content}
                                onTextChange={(e: EditorTextChangeEvent) => setContent(e.htmlValue || '')}
                                headerTemplate={editorHeader}
                                style={{ height: '500px' }}
                                className="border border-gray-300 rounded-md"
                            />
                        )}
                </div>
            </main>
        </div>
    );
}
