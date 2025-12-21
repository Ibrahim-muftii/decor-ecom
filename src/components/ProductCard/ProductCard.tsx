'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaStar, FaShoppingCart, FaLeaf } from 'react-icons/fa';
import styles from './ProductCard.module.css';
import { addToCart } from '@/lib/cartUtils';

interface ProductProps {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    category: string;
    image_url?: string;
    rating?: number;
}

const ProductCard = ({ product, id, name, category, price, discountPrice, image_url, rating }: { product?: ProductProps } & Partial<ProductProps>) => {
    // Handle both prop patterns
    const item = product || { id, name, category, price, discountPrice, image_url, rating };
    // ... existing logic ...
    const itemPrice = item.price || 0;
    const displayPrice = item.discountPrice || itemPrice;
    const hasDiscount = item.discountPrice && item.discountPrice < itemPrice;

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.card}>
                <Link href={`/product/${item.id}`} className={styles.link} />

                {/* Floating Organic Badge */}
                {hasDiscount && (
                    <div className={styles.badge}>
                        <FaLeaf className={styles.leafIcon} />
                        <span>Save {Math.round((1 - item.discountPrice! / item.price!) * 100)}%</span>
                    </div>
                )}

                <button className={styles.wishlistBtn}>
                    <FaHeart />
                </button>

                <div className={styles.imageContainer}>
                    <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=500'}
                        alt={item.name || 'Product'}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.overlay} />
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <span className={styles.category}>{item.category}</span>
                        <div className={styles.rating}>
                            <FaStar className={styles.star} />
                            <span>{item.rating || 4.5}</span>
                        </div>
                    </div>

                    <h3 className={styles.title}>{item.name}</h3>

                    <div className={styles.footer}>
                        <div className={styles.priceContainer}>
                            {hasDiscount && (
                                <span className={styles.originalPrice}>${item.price?.toFixed(2)}</span>
                            )}
                            <span className={styles.price}>${displayPrice?.toFixed(2)}</span>
                        </div>

                        <button
                            className={styles.addBtn}
                            onClick={(e) => {
                                addToCart(item.id!, 1);
                            }}
                        >
                            <FaShoppingCart />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
