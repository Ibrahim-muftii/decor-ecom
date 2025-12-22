'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaBan, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import styles from './UserTable.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserTableProps {
    users: any[];
    currentPage: number;
    totalPages: number;
    searchQuery: string;
}

const UserTable: React.FC<UserTableProps> = ({ users, currentPage, totalPages, searchQuery }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: '', action: '' as 'delete' | 'block' | 'unblock' | '' });
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        params.set('query', localSearch);
        params.set('page', '1');
        params.set('tab', 'users');
        router.push(`/admin?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        params.set('tab', 'users');
        router.push(`/admin?${params.toString()}`);
    };

    const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
        setLoading(true);
        console.log('🔒 Attempting to toggle block status for user:', userId, 'Current status:', currentStatus);

        const { data, error } = await supabase
            .from('profiles')
            .update({ is_blocked: !currentStatus })
            .eq('id', userId)
            .select();

        console.log('Block/Unblock response:', { data, error });

        if (error) {
            console.error('❌ Block/Unblock error:', error);
            toast.error(`Failed to update user status: ${error.message}`);
        } else {
            console.log('✅ User status updated successfully');
            toast.success(currentStatus ? 'User unblocked' : 'User blocked');
            router.refresh();
        }
        setLoading(false);
        setConfirmDialog({ isOpen: false, userId: '', action: '' });
    };

    const handleDelete = async (userId: string) => {
        setLoading(true);
        console.log('🗑️ Attempting to delete user:', userId);

        const { data, error } = await supabase
            .from('profiles')
            .update({ is_deleted: true })
            .eq('id', userId)
            .select();

        console.log('Delete response:', { data, error });

        if (error) {
            console.error('❌ Delete error:', error);
            toast.error(`Failed to delete user: ${error.message}`);
        } else {
            console.log('✅ User deleted successfully');
            toast.success('User deleted successfully');
            router.refresh();
        }
        setLoading(false);
        setConfirmDialog({ isOpen: false, userId: '', action: '' });
    };

    const openConfirm = (userId: string, action: 'delete' | 'block' | 'unblock') => {
        setConfirmDialog({ isOpen: true, userId, action });
    };

    const getConfirmMessage = () => {
        switch (confirmDialog.action) {
            case 'delete':
                return 'Are you sure you want to delete this user? They will be marked as deleted but data will be preserved.';
            case 'block':
                return 'Are you sure you want to block this user? They will not be able to log in.';
            case 'unblock':
                return 'Are you sure you want to unblock this user? They will regain access to the app.';
            default:
                return '';
        }
    };

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <h2 className={styles.title}>User Management</h2>
                <form onSubmit={handleSearch} className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by email..."
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
                            <th>Email</th>
                            <th>Role</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th>Created</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No users found</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 500 }}>{user.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${user.role === 'admin' ? styles.bgPurple : styles.bgBlue}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`${styles.badge} ${user.is_blocked ? styles.bgRed : styles.bgGreen}`}>
                                            {user.is_blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => openConfirm(user.id, user.is_blocked ? 'unblock' : 'block')}
                                            className={`${styles.actionBtn} ${user.is_blocked ? styles.unblockBtn : styles.blockBtn}`}
                                            title={user.is_blocked ? 'Unblock' : 'Block'}
                                            disabled={loading || user.role === 'admin'}
                                        >
                                            {user.is_blocked ? <FaCheckCircle /> : <FaBan />}
                                        </button>
                                        <button
                                            onClick={() => openConfirm(user.id, 'delete')}
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            title="Delete"
                                            disabled={loading || user.role === 'admin'}
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

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.action === 'delete' ? 'Delete User' : confirmDialog.action === 'block' ? 'Block User' : 'Unblock User'}
                message={getConfirmMessage()}
                confirmText={confirmDialog.action === 'delete' ? 'Delete' : confirmDialog.action === 'block' ? 'Block' : 'Unblock'}
                cancelText="Cancel"
                variant={confirmDialog.action === 'delete' ? 'danger' : 'warning'}
                onConfirm={() => {
                    const user = users.find(u => u.id === confirmDialog.userId);
                    if (confirmDialog.action === 'delete') {
                        handleDelete(confirmDialog.userId);
                    } else {
                        handleToggleBlock(confirmDialog.userId, user?.is_blocked || false);
                    }
                }}
                onCancel={() => setConfirmDialog({ isOpen: false, userId: '', action: '' })}
            />
        </div>
    );
};

export default UserTable;
