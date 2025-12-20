'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Roses', 'Orchids', 'Lilies', 'Tulips', 'Peonies', 'Daisies'];
const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Under $30', min: 0, max: 30 },
    { label: '$30 - $50', min: 30, max: 50 },
    { label: 'Over $50', min: 50, max: 10000 },
];
const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
];

interface ShopClientProps {
    products: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export default function ShopClient({ products, totalCount, currentPage, totalPages }: ShopClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const activeCategory = searchParams.get('category') || 'All';
    const activeSort = searchParams.get('sort') || 'newest';
    const activeMin = Number(searchParams.get('min')) || 0;
    const activeMax = Number(searchParams.get('max')) || 10000;

    const updateParams = (updates: any) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined || value === 'All' || value === 0 && key === 'min' || value === 10000 && key === 'max') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        }
        // Always reset to page 1 on filter change unless specifically changing page
        if (!updates.page) params.set('page', '1');

        router.push(`/shop?${params.toString()}`);
    };

    const handleCategoryChange = (cat: string) => updateParams({ category: cat });

    const handlePriceChange = (min: number, max: number) => updateParams({ min, max });

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => updateParams({ sort: e.target.value });

    const handlePageChange = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', p.toString());
        router.push(`/shop?${params.toString()}`);
    };

    const activePriceLabel = PRICE_RANGES.find(r => r.min === activeMin && r.max === activeMax)?.label || 'Custom';

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Our Collection</h1>
                <p className={styles.subtitle}>Discover handcrafted beauty for every corner.</p>
            </header>

            {/* Mobile Filter Toggle */}
            <button className={styles.mobileFilterBtn} onClick={() => setShowFilters(!showFilters)}>
                <FaFilter /> Filters
            </button>

            <div className={styles.content}>
                {/* Sidebar Filters */}
                <aside className={`${styles.sidebar} ${showFilters ? styles.showSidebar : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>Filters</h3>
                        <button className={styles.closeBtn} onClick={() => setShowFilters(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className={styles.filterGroup}>
                        <h4 className={styles.filterTitle}>Category</h4>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.filterOption} ${activeCategory === cat ? styles.active : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <div className={styles.filterGroup}>
                        <h4 className={styles.filterTitle}>Price</h4>
                        {PRICE_RANGES.map((range, i) => (
                            <button
                                key={i}
                                className={`${styles.filterOption} ${activePriceLabel === range.label ? styles.active : ''}`}
                                onClick={() => handlePriceChange(range.min, range.max)}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.main}>
                    {/* Sort & Results Count */}
                    <div className={styles.toolbar}>
                        <span className={styles.resultCount}>
                            Showing {products.length} results
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={activeSort}
                            onChange={handleSortChange}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className={styles.grid}>
                        {products.length > 0 ? products.map(product => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                discountPrice={product.discount_price}
                                image_url={product.image_url}
                                rating={product.rating}
                            />
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                No products found matching your criteria.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
