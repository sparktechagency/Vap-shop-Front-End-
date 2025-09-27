'use client';

import React from 'react';
import { useGettermspagesQuery } from '@/redux/features/admin/AdminApis';
import DOMPurify from 'dompurify';

export default function TermsModal({ isOpen, onClose, type = 'privacy-policy' }: any) {
    const { data: pageData, isLoading } = useGettermspagesQuery({ type });

    if (!isOpen) return null;

    const sanitizedContent = pageData?.data?.content
        ? DOMPurify.sanitize(pageData.data.content)
        : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="bg-white rounded-xl w-[90%] max-w-3xl p-6 relative shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Privacy Policy</h3>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                {/* Modal title */}
                {pageData?.data?.title && (
                    <h2 className="text-2xl font-bold mb-4">{pageData.data.title}</h2>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : !sanitizedContent ? (
                    <div className="text-center py-10">No content available.</div>
                ) : (
                    <div
                        className="prose max-w-none prose-h1:text-2xl prose-h1:font-bold overflow-y-auto max-h-[70vh]"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                )}
            </div>
        </div>
    );
}
