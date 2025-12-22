import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '@/lib/supabaseClient';

import AdminTabs from '@/components/Admin/AdminTabs';
import DashboardTab from '@/components/Admin/DashboardTab';
import ProductTable from '@/components/Admin/ProductTable';
import ProductForm from '@/components/Admin/ProductForm';
import OrderTable from '@/components/Admin/OrderTable';
import styles from './admin.module.css';

// Client Wrapper for Edit Logic
import AdminClientWrapper from './AdminClientWrapper';

// Server Component
// Server Component
export default async function Admin({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams;
    const currentTab = (resolvedSearchParams.tab as string) || 'dashboard';
    const pageNumber = parseInt((resolvedSearchParams.page as string) || '1');
    const searchQuery = (resolvedSearchParams.query as string) || '';
    // Fetch Data on Server
    let dashboardData: any = null;
    let productsData: { data: any[], count: number } = { data: [], count: 0 };
    let ordersData: { data: any[], count: number } = { data: [], count: 0 };
    let usersData: { data: any[], count: number } = { data: [], count: 0 };

    if (currentTab === 'dashboard') {
        // Parallel Data Fetching for Metrics
        const [
            ordersRes,
            productsRes,
            usersRes,
            lowStockRes,
            recentOrdersRes
        ] = await Promise.all([
            supabase.from('orders').select('id, total_price'),
            supabase.from('products').select('id, stock'),
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('products').select('*').lt('stock', 10).limit(5),
            supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const orders = ordersRes.data || [];
        const products = productsRes.data || [];

        // Calculate Metrics Sync
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);
        const outOfStock = products.filter(p => p.stock === 0).length;

        const metrics = {
            totalOrders: orders.length,
            totalRevenue,
            totalUsers: usersRes.count || 0,
            totalProducts: products.length,
            outOfStock
        };

        dashboardData = {
            metrics,
            lowStockProducts: lowStockRes.data || [],
            recentOrders: recentOrdersRes.data || []
        };
    }

    if (currentTab === 'products') {
        const from = (pageNumber - 1) * 8;
        const to = from + 8 - 1;

        let queryBuilder = supabase
            .from('products')
            .select('*', { count: 'exact' });

        if (searchQuery) {
            queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
        }

        const { data, count } = await queryBuilder
            .order('created_at', { ascending: false })
            .range(from, to);

        productsData = { data: data || [], count: count || 0 };
    }

    if (currentTab === 'orders') {
        const from = (pageNumber - 1) * 8;
        const to = from + 8 - 1;

        const { data, count } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        ordersData = { data: data || [], count: count || 0 };
    }

    if (currentTab === 'users') {
        const from = (pageNumber - 1) * 8;
        const to = from + 8 - 1;

        let queryBuilder = supabase
            .from('profiles')
            .select('id, email, role, is_blocked, is_deleted, created_at', { count: 'exact' })
            .eq('is_deleted', false);

        if (searchQuery) {
            queryBuilder = queryBuilder.ilike('email', `%${searchQuery}%`);
        }

        const { data, count } = await queryBuilder
            .order('created_at', { ascending: false })
            .range(from, to);

        usersData = { data: data || [], count: count || 0 };
    }

    return (
        <div className={styles.pageContainer}>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.contentWrapper}>
                <div className={styles.headerTitle}>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Manage store, products, and orders.</p>
                </div>

                {/* SSR Navigation */}
                <AdminTabs />

                {/* Client Wrapper to handle 'Edit' state and Tab Switching animation */}
                <div className={styles.tabContent}>
                    <AdminClientWrapper
                        currentTab={currentTab}
                        dashboardData={dashboardData}
                        productsData={productsData}
                        ordersData={ordersData}
                        usersData={usersData}
                        currentPage={pageNumber}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
}
