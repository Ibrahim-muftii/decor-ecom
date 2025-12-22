'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaTrash, FaArrowRight, FaMinus, FaPlus, FaTag } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';
import GlassButton from '@/components/GlassButton/GlassButton';
import styles from './page.module.css';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    products: {
        name: string;
        price: number;
        image_url: string;
    } | any; // Allow any to handle Supabase array/object inference quirks
}


export default function CartClient() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('cart_items')
                .select(`
                    id,
                    product_id,
                    quantity,
                    products (
                        name,
                        price,
                        image_url
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            const formattedData = (data || []).map((item: any) => ({
                ...item,
                products: Array.isArray(item.products) ? item.products[0] : item.products
            }));

            setCartItems(formattedData);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, newQty: number) => {
        if (newQty < 1) return;

        try {
            // Optimistic update
            setCartItems(items => items.map(item =>
                item.id === itemId ? { ...item, quantity: newQty } : item
            ));

            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: newQty })
                .eq('id', itemId);

            if (error) {
                console.error('Error updating quantity:', error);
                toast.error('Failed to update quantity');
                await fetchCart(); // Revert on error
            } else {
                toast.success('Quantity updated');
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
            toast.error('An error occurred');
            await fetchCart();
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            console.log('=== REMOVE ITEM START ===');
            console.log('Item ID to remove:', itemId);

            // Get current user to ensure we're authenticated
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error('User fetch error:', userError);
                toast.error('Authentication error');
                return;
            }

            if (!user) {
                console.error('No user found - cannot remove item');
                toast.error('Please log in to modify your cart');
                return;
            }

            console.log('User ID:', user.id);

            // First verify item exists
            const { data: checkData } = await supabase
                .from('cart_items')
                .select('id, user_id')
                .eq('id', itemId)
                .single();

            console.log('Item check:', checkData);

            // Optimistic update
            setCartItems(items => items.filter(item => item.id !== itemId));

            // Delete the item - simplified query
            const { error, data } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId)
                .select();

            console.log('Delete result:', { error, data, dataLength: data?.length });

            if (error) {
                console.error('DELETE ERROR:', error);
                toast.error(`Failed: ${error.message}`);
                await fetchCart();
            } else if (!data || data.length === 0) {
                console.error('NO ROWS DELETED - Possible RLS issue');
                toast.error('Delete blocked - check browser console');
                await fetchCart();
            } else {
                console.log('DELETE SUCCESS');
                toast.success('Removed from cart');
            }
            console.log('=== REMOVE ITEM END ===');
        } catch (err) {
            console.error('Failed to remove item:', err);
            toast.error('An error occurred while removing the item');
            await fetchCart();
        }
    };

    const handleApplyCoupon = () => {
        if (couponCode.toLowerCase() === 'welcome10') {
            setDiscount(10); // 10% or flat 10? Let's say flat $10 for demo or 10%
            // actually usually percent. Let's do 10%
            alert('Coupon Applied: 10% Off!');
        } else {
            alert('Invalid Coupon Code');
            setDiscount(0);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.products.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const shipping = subtotal > 100 ? 0 : 15.00; // Free shipping over $100
    const total = subtotal - discountAmount + shipping;

    if (loading) return <div className="p-10 text-center text-emerald-800">Loading Cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <h2>Your cart is empty</h2>
                <Link href="/shop">
                    <GlassButton>Continue Shopping</GlassButton>
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Shopping Cart</h1>
                <p className={styles.count}>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} items</p>
            </header>

            <div className={styles.layout}>
                {/* Items List */}
                <div className={styles.itemsList}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.products.image_url}
                                    alt={item.products.name}
                                    fill
                                    className={styles.itemImage}
                                />
                            </div>

                            <div className={styles.itemInfo}>
                                <div className={styles.infoTop}>
                                    <h3 className={styles.itemName}>{item.products.name}</h3>
                                    <p className={styles.itemPrice}>${item.products.price.toFixed(2)}</p>
                                </div>

                                <div className={styles.controls}>
                                    <div className={styles.qtyControl}>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className={styles.qty}>{item.quantity}</span>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    {/* Coupon Section */}
                    <div className={styles.couponSection}>
                        <div className={styles.couponInputWrapper}>
                            <FaTag className={styles.couponIcon} />
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                className={styles.couponInput}
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                        </div>
                        <button className={styles.applyBtn} onClick={handleApplyCoupon}>Apply</button>
                    </div>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className={`${styles.summaryRow} ${styles.discount}`}>
                            <span>Discount ({discount}%)</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>Total</span>
                        <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                    </div>

                    <Link href="/checkout" style={{ width: '100%' }}>
                        <button className={styles.checkoutBtn}>
                            Proceed to Checkout <FaArrowRight />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
