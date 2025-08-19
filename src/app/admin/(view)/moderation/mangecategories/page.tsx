

// 'use client';
// import { useCreateACategoryMutation, useDelteACategoryMutation, useGetAllAdminCategoryQuery, useGetallCategorysQuery, useUpdateCategoryMutation } from '@/redux/features/Home/HomePageApi';
// // NOTE: The import path has been adjusted to a relative path to resolve the build error.
// // You may need to change './redux/features/Home/HomePageApi' to the correct path in your project structure.


// import { useState, useMemo, useRef, FormEvent, FC } from 'react';
// import { toast } from 'sonner';


// // --- TYPE DEFINITION ---
// interface ApiCategory {
//     id: number;
//     name: string;
//     image: string | null;
//     created_at: string;
//     updated_at: string;
//     brand_products_count: number;
//     wholesale_products_count: number;
//     store_products_count: number;
// }

// // --- REUSABLE COMPONENTS ---

// // ## Confirmation Modal Component
// interface ConfirmationModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     title: string;
//     message: string;
//     isConfirming: boolean;
// }

// const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isConfirming }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
//                 <h2 className="text-xl font-bold mb-4">{title}</h2>
//                 <p className="text-gray-700 mb-6">{message}</p>
//                 <div className="flex justify-end gap-4">
//                     <button
//                         onClick={onClose}
//                         disabled={isConfirming}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={onConfirm}
//                         disabled={isConfirming}
//                         className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait"
//                     >
//                         {isConfirming ? 'Deleting...' : 'Delete'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // ## Category Form Component
// interface CategoryFormProps {
//     onAddCategory: (formData: FormData) => Promise<void>;
//     isLoading: boolean;
// }

// const CategoryForm: React.FC<CategoryFormProps> = ({ onAddCategory, isLoading }) => {
//     const [name, setName] = useState('');
//     const [image, setImage] = useState<File | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!name || !image) {
//             toast.error('Please provide both a name and an image.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('image', image);

//         await onAddCategory(formData);

//         setName('');
//         setImage(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//             <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                         Category Name
//                     </label>
//                     <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Enter category name" disabled={isLoading} />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
//                         Category Image
//                     </label>
//                     <input id="image" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className=" text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isLoading} />
//                 </div>
//                 <button type="submit" disabled={isLoading || !name || !image} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
//                     {isLoading ? 'Adding...' : 'Add Category'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// // ## Category Table Component
// interface CategoryTableProps {
//     categories: ApiCategory[];
//     onDeleteCategory: (id: number) => void; // This will now open the modal
//     isDeleting: boolean;
// }

// const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDeleteCategory, isDeleting }) => {
//     const PLACEHOLDER_IMAGE = "https://placehold.co/40x40/EBF4FF/3B82F6?text=Img"; // Placeholder for null images

//     if (categories.length === 0) {
//         return <p className="text-center text-gray-500">No categories found.</p>;
//     }

//     return (
//         <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">store_products_count</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wholesale_products_count</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand_products_count</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {categories.map((category) => (
//                         <tr key={category.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <img src={category.image || PLACEHOLDER_IMAGE} alt={category.name} className="w-10 h-10 object-cover rounded" onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)} />
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">{new Date(category.created_at).toLocaleDateString()}</div>
//                             </td>

//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">{category.store_products_count}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">{category.wholesale_products_count}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">{category.brand_products_count}</div>
//                             </td>










//                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                 <button
//                                     onClick={() => onDeleteCategory(category.id)}
//                                     className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     disabled={isDeleting} // Disable button if any deletion is in progress
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };


// // --- MAIN PAGE COMPONENT ---
// export default function CategoryManagement() {
//     // 1. RTK Query hooks
//     const { data: categoryResponse, isLoading: isLoadingCategories, isError, error } = useGetAllAdminCategoryQuery();
//     const [createACategory, { isLoading: isCreating }] = useCreateACategoryMutation();
//     const [deleteACategory, { isLoading: isDeleting }] = useDelteACategoryMutation();
//     const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

//     // 2. UI State
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
//     console.log('categoryResponse', categoryResponse);

//     // 3. Modal State
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);


//     // 4. Memoized data processing
//     const allCategories = useMemo(() => {
//         if (categoryResponse && categoryResponse.ok) {
//             return categoryResponse.data || [];
//         }
//         return [];
//     }, [categoryResponse]);

//     const filteredCategories = useMemo(() => {
//         return allCategories.filter((category: ApiCategory) =>
//             category.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [allCategories, searchTerm]);

//     const paginatedCategories = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
//     }, [filteredCategories, currentPage]);
//     console.log('paginatedCategories', paginatedCategories);

//     const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

//     // 5. Handlers
//     const handleAddCategory = async (formData: FormData) => {
//         try {
//             const res = await createACategory(formData).unwrap();
//             if (!res.ok) throw new Error(res.message);
//             if (res.ok) {
//                 toast.success('Category created successfully!');
//             }
//         } catch (err) {
//             toast.error('Failed to create category.');
//             console.error(err);
//         }
//     };

//     // Opens the confirmation modal
//     const handleOpenDeleteModal = (id: number) => {
//         setCategoryToDelete(id);
//         setIsModalOpen(true);
//     };

//     // Closes the confirmation modal
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setCategoryToDelete(null);
//     };

//     // Executes the deletion after confirmation
//     const handleConfirmDelete = async () => {
//         if (categoryToDelete === null) return;

//         try {
//             await deleteACategory(categoryToDelete).unwrap();
//             toast.success('Category deleted successfully!');
//         } catch (err) {
//             toast.error('Failed to delete category.');
//             console.error(err);
//         } finally {
//             handleCloseModal(); // Close modal on success or failure
//         }
//     };

//     // 6. Render the component
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-6">Category Management</h1>

//             <CategoryForm onAddCategory={handleAddCategory} isLoading={isCreating} />

//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">Existing Categories</h2>
//                     <input
//                         type="text"
//                         placeholder="Search categories..."
//                         value={searchTerm}
//                         onChange={e => {
//                             setSearchTerm(e.target.value);
//                             setCurrentPage(1);
//                         }}
//                         className="shadow-sm appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
//                     />
//                 </div>

//                 {isLoadingCategories ? (
//                     <p>Loading categories...</p>
//                 ) : isError ? (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                         {/* A generic error message is better for the user than error.toString() */}
//                         <p>Sorry, an error occurred while fetching categories.</p>
//                     </div>
//                 ) : (
//                     <>
//                         <CategoryTable
//                             categories={paginatedCategories}
//                             onDeleteCategory={handleOpenDeleteModal} // Changed to open modal
//                             isDeleting={isDeleting}
//                         />
//                         {totalPages > 1 && (
//                             <div className="flex justify-between items-center mt-4">
//                                 <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
//                                     Previous
//                                 </button>
//                                 <span>Page {currentPage} of {totalPages}</span>
//                                 <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             <ConfirmationModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 onConfirm={handleConfirmDelete}
//                 title="Delete Category"
//                 message="Are you sure you want to delete this category? All products under this category will also be deleted. This action cannot be undone."
//                 isConfirming={isDeleting}
//             />
//         </div>
//     );
// }


'use client';
import { useCreateACategoryMutation, useDelteACategoryMutation, useGetAllAdminCategoryQuery, useUpdateCategoryMutation } from '@/redux/features/Home/HomePageApi';
// NOTE: The import path has been adjusted to a relative path.
// You may need to change './redux/features/Home/HomePageApi' to the correct path in your project structure.

import { useState, useMemo, useRef, FormEvent, FC, useEffect } from 'react';
import { toast } from 'sonner';

// --- TYPE DEFINITION ---
interface ApiCategory {
    id: number;
    name: string;
    image: string | null;
    created_at: string;
    updated_at: string;
    brand_products_count: number;
    wholesale_products_count: number;
    store_products_count: number;
}


// --- REUSABLE COMPONENTS ---

// ## Confirmation Modal Component
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isConfirming: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isConfirming }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isConfirming ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ## Edit Category Modal Component (NEW)
interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (formData: FormData) => Promise<void>;
    category: ApiCategory | null;
    isUpdating: boolean;
}

const EditCategoryModal: FC<EditCategoryModalProps> = ({ isOpen, onClose, onConfirm, category, isUpdating }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Pre-fill the form when a category is selected for editing
        if (category) {
            setName(category.name);
        }
        // Reset image field when modal opens
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [category]);

    if (!isOpen || !category) return null;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        // Only append fields that have changed
        if (name !== category.name) {
            formData.append('name', name);
        }
        if (image) {
            formData.append('image', image);
        }

        // Check if there is anything to update
        if (!formData.has('name') && !formData.has('image')) {
            toast.info("No changes were made.");
            onClose();
            return;
        }

        await onConfirm(formData);
    };


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">Edit Category: {category.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                            Category Name
                        </label>
                        <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" disabled={isUpdating} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-image">
                            Replace Image (Optional)
                        </label>
                        <input id="edit-image" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isUpdating} />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isUpdating} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait">
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


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

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        await onAddCategory(formData);

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

// ## Category Table Component (UPDATED)
interface CategoryTableProps {
    categories: ApiCategory[];
    onDeleteCategory: (id: number) => void;
    onEditCategory: (category: ApiCategory) => void; // New prop
    isDeleting: boolean;
    isUpdating: boolean; // New prop
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDeleteCategory, onEditCategory, isDeleting, isUpdating }) => {
    const PLACEHOLDER_IMAGE = "https://placehold.co/40x40/EBF4FF/3B82F6?text=Img";

    if (categories.length === 0) {
        return <p className="text-center text-gray-500">No categories found.</p>;
    }

    const isActionDisabled = isDeleting || isUpdating; // Combine loading states

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wholesale Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Products</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={category.image || PLACEHOLDER_IMAGE} alt={category.name} className="w-10 h-10 object-cover rounded" onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{new Date(category.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-center font-medium text-gray-900">{category.store_products_count}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-center font-medium text-gray-900">{category.wholesale_products_count}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-center font-medium text-gray-900">{category.brand_products_count}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEditCategory(category)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    disabled={isActionDisabled}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    disabled={isActionDisabled}
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


// --- MAIN PAGE COMPONENT (UPDATED) ---
export default function CategoryManagement() {
    // 1. RTK Query hooks
    const { data: categoryResponse, isLoading: isLoadingCategories, isError } = useGetAllAdminCategoryQuery();
    const [createACategory, { isLoading: isCreating }] = useCreateACategoryMutation();
    const [deleteACategory, { isLoading: isDeleting }] = useDelteACategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    // 2. UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 3. Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
    const [categoryToEdit, setCategoryToEdit] = useState<ApiCategory | null>(null); // New state for category being edited


    // 4. Memoized data processing
    const allCategories = useMemo(() => {
        return (categoryResponse?.ok && categoryResponse.data) ? categoryResponse.data : [];
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

    // 5. Handlers
    const handleAddCategory = async (formData: FormData) => {
        try {
            const res = await createACategory(formData).unwrap();
            if (!res.ok) throw new Error(res.message);
            toast.success('Category created successfully!');
        } catch (err) {
            toast.error('Failed to create category.');
            console.error(err);
        }
    };

    // --- Delete Handlers ---
    const handleOpenDeleteModal = (id: number) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete === null) return;
        try {
            await deleteACategory(categoryToDelete).unwrap();
            toast.success('Category deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete category.');
            console.error(err);
        } finally {
            handleCloseDeleteModal();
        }
    };

    // --- Edit Handlers (NEW) ---
    const handleOpenEditModal = (category: ApiCategory) => {
        setCategoryToEdit(category);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setCategoryToEdit(null);
    };

    const handleConfirmEdit = async (formData: FormData) => {
        if (!categoryToEdit) return;

        // **Append _method: 'PUT' to use a POST request for updating**
        formData.append('_method', 'PUT');

        try {
            // The `updateCategory` mutation expects an object with `id` and `formData`
            await updateCategory({ id: categoryToEdit.id, formData }).unwrap();
            toast.success('Category updated successfully!');
            handleCloseEditModal();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update category.');
            console.error(err);
        }
    };

    // 6. Render the component
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
                            setCurrentPage(1);
                        }}
                        className="shadow-sm appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                    />
                </div>

                {isLoadingCategories ? (
                    <p>Loading categories...</p>
                ) : isError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>Sorry, an error occurred while fetching categories.</p>
                    </div>
                ) : (
                    <>
                        <CategoryTable
                            categories={paginatedCategories}
                            onDeleteCategory={handleOpenDeleteModal}
                            onEditCategory={handleOpenEditModal} // Pass the new handler
                            isDeleting={isDeleting}
                            isUpdating={isUpdating} // Pass the updating state
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

            {/* Render Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                isConfirming={isDeleting}
            />

            {/* Render Edit Category Modal */}
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onConfirm={handleConfirmEdit}
                category={categoryToEdit}
                isUpdating={isUpdating}
            />
        </div>
    );
}