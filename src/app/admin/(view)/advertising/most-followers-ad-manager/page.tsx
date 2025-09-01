'use client';

import React, { useState, useEffect, useRef } from 'react';

const MoreVertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const EditPriceModal = ({ isOpen, onClose, slotNumber }: { isOpen: boolean; onClose: () => void; slotNumber: number }) => {
    if (!isOpen) return null;

    const weekLabels = ["Week 1:", "Week 2:", "Week 3:", "Week 4:"];

    return (
        <div className="fixed inset-0 bg-black/35  flex justify-center items-center z-50 p-4">
            {/* Modal Panel */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8 transform transition-all">
                <header className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Edit Slot {slotNumber} Price</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon />
                    </button>
                </header>

                {/* Form Content */}
                <form className="space-y-6">
                    {weekLabels.map((label, index) => (
                        <div key={index}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                type="text"
                                placeholder="Name your price"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            onClick={(e) => { e.preventDefault(); onClose(); }} // Prevents page reload and closes modal
                            className="bg-gray-900 text-white font-bold py-2 px-8 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdCard = ({ slotNumber, title, brand, imageUrl }: { slotNumber: number; title: string; brand: string; imageUrl: string }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEditClick = () => {
        setIsMenuOpen(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                {/* Header with Slot number and Three-dot menu */}
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-600">Slot {slotNumber}</p>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
                        >
                            <MoreVertIcon />
                        </button>
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-10">
                                <button
                                    onClick={handleEditClick}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                                >
                                    <EditIcon />
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-md overflow-hidden h-48 mb-4">
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">{brand}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="w-full bg-gray-900 text-white font-bold text-sm py-2 rounded-md hover:bg-gray-700 transition-colors">
                        View
                    </button>
                    <button className="w-full bg-white text-red-600 border border-red-600 font-bold text-sm py-2 rounded-md hover:bg-red-50 transition-colors">
                        Delete
                    </button>
                </div>
            </div>

            {/* Render the modal */}
            <EditPriceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slotNumber={slotNumber}
            />
        </>
    );
};


function AdManagementPage() {
    const adData = [
        { id: 1, slotNumber: 1, title: 'Vodoo MOD Ultron X', brand: 'Brand: Vodoo', imageUrl: 'https://placehold.co/400x300/e8e8e8/555?text=Ad+1' },
        { id: 2, slotNumber: 2, title: 'AeroGlide Drone', brand: 'Brand: Aero', imageUrl: 'https://placehold.co/400x300/d1d1d1/555?text=Ad+2' },
        { id: 3, slotNumber: 3, title: 'Quantum Smartwatch', brand: 'Brand: Quantum', imageUrl: 'https://placehold.co/400x300/e8e8e8/555?text=Ad+3' },
        { id: 4, slotNumber: 4, title: 'EcoPure Water Filter', brand: 'Brand: EcoPure', imageUrl: 'https://placehold.co/400x300/d1d1d1/555?text=Ad+4' },
        { id: 5, slotNumber: 5, title: 'Nova Laptop Pro', brand: 'Brand: Nova', imageUrl: 'https://placehold.co/400x300/e8e8e8/555?text=Ad+5' },
        { id: 6, slotNumber: 6, title: 'SoundWave Headphones', brand: 'Brand: SoundWave', imageUrl: 'https://placehold.co/400x300/d1d1d1/555?text=Ad+6' },
    ];

    return (
        <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 md:p-8 font-['Montserrat']">
            <header className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    Ad Request Management
                </h1>
                <p className="mt-2 text-gray-600">
                    Review, approve, and manage ad placements across the platform.
                </p>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Most followers Ad Manager
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adData.map(ad => (
                            <AdCard key={ad.id} {...ad} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="relative">
                            <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500">
                                <option>Select Category</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500">
                                <option>Select Region</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Edit Description
                        </h2>
                        <textarea
                            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Type here..."
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdManagementPage;