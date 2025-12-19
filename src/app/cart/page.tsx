'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import styles from './page.module.css';

// Mock Data
const CART_ITEMS = [
    { id: '1', name: 'Golden Orchid', price: 45.99, quantity: 1, image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=500' },
    { id: '2', name: 'Velvet Rose', price: 29.50, quantity: 2, image_url: 'https://images.unsplash.com/photo-1548602088-9d12a4f9c10d?auto=format&fit=crop&q=80&w=500' },
];

export default function Cart() {
    const subtotal = CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Shopping Cart</h1>
                <p className={styles.count}>{CART_ITEMS.reduce((acc, i) => acc + i.quantity, 0)} items</p>
            </header>

            <div className={styles.layout}>
                <div className={styles.itemsList}>
                    {CART_ITEMS.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className={styles.itemImage}
                                />
                            </div>

                            <div className={styles.itemInfo}>
                                <div className={styles.infoTop}>
                                    <h3 className={styles.itemName}>{item.name}</h3>
                                    <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                                </div>

                                <div className={styles.controls}>
                                    <div className={styles.qtyControl}>
                                        <button className={styles.qtyBtn}><FaMinus /></button>
                                        <span className={styles.qty}>{item.quantity}</span>
                                        <button className={styles.qtyBtn}><FaPlus /></button>
                                    </div>
                                    <button className={styles.removeBtn}>
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
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
