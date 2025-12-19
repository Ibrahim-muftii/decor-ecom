'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaMinus, FaPlus, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Enhanced Mock Data
const PRODUCTS = [
    {
        id: '1',
        name: 'Golden Orchid',
        category: 'Orchids',
        price: 45.99,
        discountPrice: 39.99,
        description: 'A stunning handcrafted golden orchid encased in premium glass. Captures the light beautifully and adds a touch of royalty to any setting. Each piece is individually crafted by skilled artisans.',
        additionalInfo: {
            'Material': 'Premium Crystal Glass',
            'Dimensions': '12" x 8" x 6"',
            'Weight': '1.5 lbs',
            'Care': 'Dust with soft cloth',
            'Origin': 'Handcrafted in Italy'
        },
        image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=500',
        colors: ['Gold', 'Silver', 'Rose Gold'],
        bunchesAvailable: [6, 12, 24],
        rating: 4.8,
        stock: 15
    },
    {
        id: '2',
        name: 'Velvet Rose',
        category: 'Roses',
        price: 29.50,
        description: 'A deep velvet red rose with delicate glass petals. A symbol of eternal love and passion.',
        additionalInfo: {
            'Material': 'Crystal Glass',
            'Dimensions': '10" x 4" x 4"',
            'Weight': '0.8 lbs',
            'Care': 'Handle with care',
            'Origin': 'Handcrafted in France'
        },
        image_url: 'https://images.unsplash.com/photo-1548602088-9d12a4f9c10d?auto=format&fit=crop&q=80&w=500',
        colors: ['Red', 'Pink', 'White'],
        bunchesAvailable: [6, 12],
        rating: 4.5,
        stock: 22
    },
    {
        id: '3',
        name: 'Crystal Lily',
        category: 'Lilies',
        price: 55.00,
        discountPrice: 45.00,
        description: 'Pure crystal lily vase arrangement. Minimalist design that fits perfectly in modern homes.',
        additionalInfo: {
            'Material': 'Pure Crystal',
            'Dimensions': '14" x 6" x 6"',
            'Weight': '2 lbs',
            'Care': 'Clean with microfiber',
            'Origin': 'Handcrafted in Czech Republic'
        },
        image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500',
        colors: ['Clear', 'Frost', 'Tinted'],
        bunchesAvailable: [6, 12, 18, 24],
        rating: 4.9,
        stock: 8
    },
];

export default function ProductDetails() {
    const params = useParams();
    const id = params?.id as string;

    const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
    const relatedProducts = PRODUCTS.filter(p => p.id !== product.id);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [selectedBunches, setSelectedBunches] = useState(product.bunchesAvailable?.[0] || 6);
    const [activeTab, setActiveTab] = useState<'description' | 'info'>('description');

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const finalPrice = hasDiscount ? product.discountPrice : product.price;

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

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
                                -{Math.round((1 - product.discountPrice! / product.price) * 100)}%
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
                        <span>{product.rating}</span>
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
                                {product.colors.map(color => (
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
                    {product.bunchesAvailable && product.bunchesAvailable.length > 0 && (
                        <div className={styles.optionGroup}>
                            <label className={styles.optionLabel}>Bunches</label>
                            <div className={styles.bunchOptions}>
                                {product.bunchesAvailable.map(bunch => (
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

                        <GlassButton fullWidth variant="accent">
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
                    {activeTab === 'info' && product.additionalInfo && (
                        <table className={styles.infoTable}>
                            <tbody>
                                {Object.entries(product.additionalInfo).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className={styles.infoKey}>{key}</td>
                                        <td className={styles.infoValue}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <div className={styles.relatedSection}>
                <h2 className={styles.sectionTitle}>Related Products</h2>
                <div className={styles.relatedGrid}>
                    {relatedProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            category={p.category}
                            price={p.price}
                            discountPrice={p.discountPrice}
                            image_url={p.image_url}
                            rating={p.rating}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
