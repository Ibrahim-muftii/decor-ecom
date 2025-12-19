'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Enhanced Mock Data
const PRODUCTS = [
    { id: '1', name: 'Golden Orchid', price: 45.99, discountPrice: 39.99, category: 'Orchids', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=500', rating: 4.8, colors: ['Gold', 'Silver'] },
    { id: '2', name: 'Velvet Rose', price: 29.50, category: 'Roses', image_url: 'https://images.unsplash.com/photo-1548602088-9d12a4f9c10d?auto=format&fit=crop&q=80&w=500', rating: 4.5, colors: ['Red', 'Pink'] },
    { id: '3', name: 'Crystal Lily', price: 55.00, discountPrice: 45.00, category: 'Lilies', image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500', rating: 4.9, colors: ['White'] },
    { id: '4', name: 'Midnight Tulip', price: 35.00, category: 'Tulips', image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=500', rating: 4.7, colors: ['Purple', 'Blue'] },
    { id: '5', name: 'Frosted Peony', price: 42.00, discountPrice: 38.00, category: 'Peonies', image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=500', rating: 4.6, colors: ['Pink', 'White'] },
    { id: '6', name: 'Sunlit Daisy', price: 28.00, category: 'Daisies', image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=500', rating: 4.4, colors: ['Yellow', 'White'] },
    { id: '7', name: 'Royal Carnation', price: 33.00, category: 'Roses', image_url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&q=80&w=500', rating: 4.3, colors: ['Red'] },
    { id: '8', name: 'Blush Hydrangea', price: 48.00, category: 'Peonies', image_url: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&q=80&w=500', rating: 4.8, colors: ['Blue', 'Pink'] },
    { id: '9', name: 'Spring Bouquet', price: 65.00, discountPrice: 55.00, category: 'Orchids', image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500', rating: 4.9, colors: ['Multi'] },
];

const CATEGORIES = ['All', 'Roses', 'Orchids', 'Lilies', 'Tulips', 'Peonies', 'Daisies'];
const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $30', min: 0, max: 30 },
    { label: '$30 - $50', min: 30, max: 50 },
    { label: 'Over $50', min: 50, max: Infinity },
];
const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' },
];
const ITEMS_PER_PAGE = 6;

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams?.get('category') || 'All';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filtered & Sorted Products
    const filteredProducts = useMemo(() => {
        let result = [...PRODUCTS];

        // Category Filter
        if (activeCategory !== 'All') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Price Filter
        result = result.filter(p => {
            const price = p.discountPrice || p.price;
            return price >= priceRange.min && price <= priceRange.max;
        });

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                break;
            case 'price-desc':
                result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default: // newest - by id descending
                result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        }

        return result;
    }, [activeCategory, priceRange, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const handlePriceChange = (range: typeof PRICE_RANGES[0]) => {
        setPriceRange(range);
        setCurrentPage(1);
    };

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
                                className={`${styles.filterOption} ${priceRange.label === range.label ? styles.active : ''}`}
                                onClick={() => handlePriceChange(range)}
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
                            Showing {paginatedProducts.length} of {filteredProducts.length} products
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className={styles.grid}>
                        {paginatedProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                discountPrice={product.discountPrice}
                                image_url={product.image_url}
                                rating={product.rating}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
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

export default function Shop() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}
