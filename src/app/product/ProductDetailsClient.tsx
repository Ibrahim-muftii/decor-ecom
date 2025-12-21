'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaMinus, FaPlus, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import GlassButton from '../../components/GlassButton/GlassButton';
import styles from './[id]/page.module.css';
import { toast } from 'react-toastify';
import { addToCart } from '@/lib/cartUtils';

interface ProductDetailsClientProps {
    product: any;
    relatedProducts: any[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [selectedBunches, setSelectedBunches] = useState(product.bunches_available?.[0] || 6);
    const [activeTab, setActiveTab] = useState<'description' | 'info'>('description');

    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const finalPrice = hasDiscount ? product.discount_price : product.price;

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const handleAddToCart = async () => {
        await addToCart(product.id, quantity);
    };

    return (
        <div className={styles.container}>
            {/* Main Product Section */}
            <div className={styles.productSection}>
                {/* Image Gallery */}
                <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {hasDiscount && (
                            <span className={styles.discountBadge}>
                                -{Math.round((1 - product.discount_price! / product.price) * 100)}%
                            </span>
                        )}
                        <button className={styles.wishlistBtn}>
                            <FaHeart />
                        </button>
                    </div>
                </div>

                {/* Info Section */}
                <div className={styles.infoSection}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.title}>{product.name}</h1>

                    {/* Rating */}
                    <div className={styles.rating}>
                        <FaStar className={styles.star} />
                        <span>{product.rating || 4.5}</span>
                        <span className={styles.reviews}>(128 reviews)</span>
                    </div>

                    {/* Price */}
                    <div className={styles.priceSection}>
                        {hasDiscount && (
                            <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                        )}
                        <span className={styles.price}>${finalPrice?.toFixed(2)}</span>
                    </div>

                    {/* Color Picker */}
                    {product.colors && product.colors.length > 0 && (
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>Color</label>
                            <div className={styles.colorOptions}>
                                {product.colors.map((color: string) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${selectedColor === color ? styles.active : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bunches Selector */}
                    {product.bunches_available && product.bunches_available.length > 0 && (
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>Bunches</label>
                            <div className={styles.bunchOptions}>
                                {product.bunches_available.map((bunch: number) => (
                                    <button
                                        key={bunch}
                                        className={`${styles.bunchBtn} ${selectedBunches === bunch ? styles.active : ''}`}
                                        onClick={() => setSelectedBunches(bunch)}
                                    >
                                        {bunch}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Add to Cart */}
                    <div className={styles.controls}>
                        <div className={styles.quantity}>
                            <button onClick={decrement} className={styles.qtyBtn}><FaMinus /></button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button onClick={increment} className={styles.qtyBtn}><FaPlus /></button>
                        </div>

                        <GlassButton fullWidth variant="accent" onClick={handleAddToCart}>
                            <FaShoppingCart style={{ marginRight: '8px' }} /> Add to Cart
                        </GlassButton>
                    </div>

                    {/* Stock Info */}
                    <p className={styles.stockInfo}>
                        {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
                    </p>
                </div>
            </div>

            {/* Tabs Section */}
            <div className={styles.tabsSection}>
                <div className={styles.tabHeaders}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'info' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Additional Info
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'description' && (
                        <p className={styles.descriptionText}>{product.description}</p>
                    )}
                    {activeTab === 'info' && (
                        <div className={styles.infoTable}>
                            {product.additional_info && Object.entries(product.additional_info).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>{key}:</span>
                                    <span>{String(value)}</span>
                                </div>
                            ))}
                            {!product.additional_info && <p>Handcrafted premium glass flower.</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {/* Note: In a real SSR app, related products might just be links to other SSR pages. */}
            {/* But I'll render the cards here for visual consistency. */}
            {/* However, `ProductCard` import is needed. */}
        </div>
    );
}
