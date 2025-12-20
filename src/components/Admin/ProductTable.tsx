'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './ProductTable.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProductTableProps {
    products: any[];
    currentPage: number;
    totalPages: number;
    searchQuery: string;
    onEdit: (product: any) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, currentPage, totalPages, searchQuery, onEdit }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        params.set('query', localSearch);
        params.set('page', '1'); // Reset to page 1
        router.push(`/admin?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/admin?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            toast.error('Failed to delete product');
        } else {
            toast.success('Product deleted successfully');
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <h2 className={styles.title}>Product List</h2>
                <form onSubmit={handleSearch} className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className={styles.searchInput}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </form>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th style={{ textAlign: 'center' }}>Stock</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No products found</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td style={{ color: '#10b981', fontWeight: 600 }}>${product.price}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`${styles.badge} ${product.stock === 0 ? styles.bgRed :
                                            product.stock < 10 ? styles.bgAmber :
                                                styles.bgGreen
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => onEdit(product)}
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Showing {currentPage} of {totalPages} pages</span>
                    <div className={styles.pageControls}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={styles.pageBtn}
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={styles.pageBtn}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
