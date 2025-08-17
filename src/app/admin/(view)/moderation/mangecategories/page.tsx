'use client';
import { useCreateACategoryMutation, useDelteACategoryMutation, useGetallCategorysQuery } from '@/redux/features/Home/HomePageApi'; // Assuming you have a delete mutation

import { useState, useMemo, useRef, FormEvent } from 'react';
import { toast } from 'sonner';


// --- TYPE DEFINITION (Updated to match your API response) ---
interface ApiCategory {
    id: number;
    name: string;
    image: string | null; // Can be a URL string or null
    created_at: string;
    updated_at: string;
}


// --- REUSABLE COMPONENTS ---

// ## Category Form Component
interface CategoryFormProps {
    onAddCategory: (formData: FormData) => Promise<void>;
    isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onAddCategory, isLoading }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !image) {
            toast.error('Please provide both a name and an image.');
            return;
        }

        // Create FormData to send to the API
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        await onAddCategory(formData);

        // Reset form state after successful submission
        setName('');
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Category Name
                    </label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Enter category name" disabled={isLoading} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Category Image
                    </label>
                    <input id="image" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className=" text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isLoading} />
                </div>
                <button type="submit" disabled={isLoading || !name || !image} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
        </div>
    );
};

// ## Category Table Component (Updated to handle null images)
interface CategoryTableProps {
    categories: ApiCategory[];
    onDeleteCategory: (id: number) => void;
    isDeleting: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDeleteCategory, isDeleting }) => {
    const PLACEHOLDER_IMAGE = "https://via.placeholder.com/40"; // Placeholder for null images

    if (categories.length === 0) {
        return <p className="text-center text-gray-500">No categories found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={category.image || PLACEHOLDER_IMAGE} alt={category.name} className="w-10 h-10 object-cover rounded" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{new Date(category.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isDeleting}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- MAIN PAGE COMPONENT (Refactored for RTK Query) ---
export default function CategoryManagement() {
    // 1. Get data with RTK Query hooks
    const { data: categoryResponse, isLoading: isLoadingCategories, isError, error } = useGetallCategorysQuery();
    const [createACategory, { isLoading: isCreating }] = useCreateACategoryMutation();
    const [deleteACategory, { isLoading: isDeleting }] = useDelteACategoryMutation(); // Assuming you create this hook

    // 2. State for UI controls (search and pagination)
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 3. Memoize and process the data from the API
    const allCategories = useMemo(() => {
        // The actual category array is in the 'data' property of the response
        if (categoryResponse && categoryResponse.ok) {
            return categoryResponse.data || [];
        }
        return [];
    }, [categoryResponse]);

    const filteredCategories = useMemo(() => {
        return allCategories.filter((category: ApiCategory) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allCategories, searchTerm]);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCategories, currentPage]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    // 4. Handlers that call the mutation hooks
    const handleAddCategory = async (formData: FormData) => {
        try {
            const res = await createACategory(formData).unwrap();
            console.log('res', res);
            if (!res.ok) throw new Error(res.message);
            if (res.ok) {

                toast.success('Category created successfully!');
            }

        } catch (err) {
            toast.error('Failed to create category.');
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteACategory(id).unwrap();
            toast.success('Category deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete category.');
            console.error(err);
        }
    };

    // 5. Render the component with derived state
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>

            <CategoryForm onAddCategory={handleAddCategory} isLoading={isCreating} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Existing Categories</h2>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="shadow-sm appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                    />
                </div>

                {isLoadingCategories ? (
                    <p>Loading categories...</p>
                ) : isError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error.toString()}
                    </div>
                ) : (
                    <>
                        <CategoryTable
                            categories={paginatedCategories}
                            onDeleteCategory={handleDeleteCategory}
                            isDeleting={isDeleting}
                        />
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}