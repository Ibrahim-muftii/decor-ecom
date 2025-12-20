import React, { Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ShopClient from './ShopClient';
import styles from './page.module.css';
import GlobalLoader from '@/components/GlobalLoader/GlobalLoader';

import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; // Ensure no caching of search params

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const category = (resolvedSearchParams.category as string) || 'All';

    return {
        title: category === 'All' ? 'Shop All Products' : `${category} Collection`,
        description: `Browse our exclusive collection of hand-blown glass ${category === 'All' ? 'flowers' : category}.`,
        alternates: {
            // Canonical points to the category page, ignoring sort/filter params to consolidate SEO juice
            canonical: category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`,
        }
    };
}

export default async function Shop({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams;
    const category = (resolvedSearchParams.category as string) || 'All';
    const sort = (resolvedSearchParams.sort as string) || 'newest';
    const minPrice = Number(resolvedSearchParams.min) || 0;
    const maxPrice = Number(resolvedSearchParams.max) || 10000;
    const page = Number(resolvedSearchParams.page) || 1;
    const limit = 6;

    // Build Query
    let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

    // Filter by Category
    if (category !== 'All') {
        query = query.eq('category', category);
    }

    // Filter by Price (Client side logic showed using discount_price or price, DB query is harder for OR logic on derived column without RPC)
    // For simplicity efficiently on DB: We filter by 'price' column. 
    // Ideally we'd use an RPC or simple range on price.
    // Let's stick to price column for now to keep it SSR fast.
    if (maxPrice < 10000) {
        query = query.lte('price', maxPrice);
    }
    if (minPrice > 0) {
        query = query.gte('price', minPrice);
    }

    // Sort
    switch (sort) {
        case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false });
            break;
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count } = await query;
    const products = data || [];
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <Suspense fallback={<GlobalLoader />}>
            <ShopClient
                products={products}
                totalCount={totalCount}
                currentPage={page}
                totalPages={totalPages}
            />
        </Suspense>
    );
}
