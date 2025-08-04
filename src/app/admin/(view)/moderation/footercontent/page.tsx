'use client';

import React, { useState } from 'react';

// 1. Define a type for a single informational item.
interface InfoItem {
    id: number;
    title: string;
    description: string;
}

// 2. Type the initial data array using the InfoItem interface.
// In a real app, this data and its type would likely come from your API layer.
const initialData: InfoItem[] = [
    {
        id: 1,
        title: '🚫 For Adults 21+:',
        description: 'Access limited to users in jurisdictions where vape-related products are legal.',
    },
    {
        id: 2,
        title: '⚠️ No Sales or Payments in App:',
        description: 'Vape Shop Maps facilitates information and store discovery only. Any consumer purchases are completed in-store. B2B transactions are managed externally.',
    },
    {
        id: 3,
        title: '📚 Built for the Community:',
        description: 'Vape Shop Maps connects vape enthusiasts, shops, and businesses — explore, learn, and grow together.',
    },
];

export default function AdminInfoPanel() {
    // 3. Type the state using the generic syntax for useState.
    const [items, setItems] = useState<InfoItem[]>(initialData);

    // 4. Add types to the handler function parameters.
    const handleInputChange = (
        id: number,
        field: 'title' | 'description', // Use a union type for specific keys
        value: string
    ) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setItems(updatedItems);
    };

    const handleAddItem = () => {
        const newItem: InfoItem = {
            id: Date.now(), // Use a unique ID like a timestamp or UUID
            title: '',
            description: '',
        };
        setItems([...items, newItem]);
    };

    const handleRemoveItem = (id: number) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    // 5. Type the form event for the submit handler.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Saving data:', items);
        alert('Data saved to console! Check the browser console (F12) to see the data structure.');
        // Example API call:
        // fetch('/api/vape-info', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(items),
        // });
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin: Edit Disclaimer Information</h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700"
                            >
                                &times;
                            </button>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item #{index + 1} Title (including emoji)
                                </label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(item.id, 'title', e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., 🚫 For Adults 21+:"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item #{index + 1} Description
                                </label>
                                <textarea
                                    value={item.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        handleInputChange(item.id, 'description', e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                    placeholder="Enter the description here..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-black text-white font-semibold rounded-md 0 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                        + Add New Item
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}