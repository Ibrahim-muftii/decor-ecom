'use client';

import React, { useState } from 'react';
import DashboardTab from '@/components/Admin/DashboardTab';
import ProductTable from '@/components/Admin/ProductTable';
import ProductForm from '@/components/Admin/ProductForm';
import OrderTable from '@/components/Admin/OrderTable';
import UserTable from '@/components/Admin/UserTable';
import { useRouter } from 'next/navigation';

interface AdminClientWrapperProps {
    currentTab: string;
    dashboardData: any;
    productsData: { data: any[], count: number };
    ordersData: { data: any[], count: number };
    usersData: { data: any[], count: number };
    currentPage: number;
    searchQuery: string;
}

const AdminClientWrapper: React.FC<AdminClientWrapperProps> = ({
    currentTab,
    dashboardData,
    productsData,
    ordersData,
    usersData,
    currentPage,
    searchQuery
}) => {
    const router = useRouter();
    // We keep edit state here because it's transient client state
    const [editProduct, setEditProduct] = useState<any | null>(null);

    const handleEditProduct = (product: any) => {
        setEditProduct(product);
        // Switch tab via router to keep URL sync'd? 
        // Or just render form? The user wants tabs.
        // Let's set URL to save-product for consistency, but pass state via client.
        router.push('/admin?tab=save-product');
    };

    // If we are on save-product, we use the local editProduct state.
    // Ideally validation: if user goes directly to save-product URL, editProduct is null (Add mode).

    const itemsPerPage = 8;

    return (
        <div style={{ width: '100%' }}>
            {currentTab === 'dashboard' && dashboardData && (
                <DashboardTab
                    metrics={dashboardData.metrics}
                    lowStockProducts={dashboardData.lowStockProducts}
                    recentOrders={dashboardData.recentOrders}
                />
            )}

            {currentTab === 'products' && (
                <ProductTable
                    products={productsData.data}
                    currentPage={currentPage}
                    totalPages={Math.ceil(productsData.count / itemsPerPage)}
                    searchQuery={searchQuery}
                    onEdit={handleEditProduct}
                />
            )}

            {currentTab === 'save-product' && (
                <div style={{ width: '100%' }}>
                    <ProductForm
                        editProduct={editProduct} // Passed from client state
                        onSuccess={() => {
                            setEditProduct(null);
                            // Optional: Redirect to products after save
                            // router.push('/admin?tab=products');
                        }}
                    />
                </div>
            )}

            {currentTab === 'users' && (
                <UserTable
                    users={usersData.data}
                    currentPage={currentPage}
                    totalPages={Math.ceil(usersData.count / itemsPerPage)}
                    searchQuery={searchQuery}
                />
            )}

            {currentTab === 'orders' && (
                <OrderTable
                    orders={ordersData.data}
                    currentPage={currentPage}
                    totalPages={Math.ceil(ordersData.count / itemsPerPage)}
                />
            )}
        </div>
    );
};

export default AdminClientWrapper;
