'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaLeaf, FaStar, FaGift, FaHeart, FaArrowRight } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Enhanced Mock Data
const FEATURED_PRODUCTS = [
  { id: '1', name: 'Golden Orchid', price: 45.99, discountPrice: 39.99, category: 'Orchids', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=500', rating: 4.8 },
  { id: '2', name: 'Velvet Rose', price: 29.50, category: 'Roses', image_url: 'https://images.unsplash.com/photo-1548602088-9d12a4f9c10d?auto=format&fit=crop&q=80&w=500', rating: 4.5 },
  { id: '3', name: 'Crystal Lily', price: 55.00, discountPrice: 45.00, category: 'Lilies', image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500', rating: 4.9 },
];

const NEW_ARRIVALS = [
  { id: '4', name: 'Midnight Tulip', price: 35.00, category: 'Tulips', image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=500', rating: 4.7 },
  { id: '5', name: 'Frosted Peony', price: 42.00, discountPrice: 38.00, category: 'Peonies', image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=500', rating: 4.6 },
  { id: '6', name: 'Sunlit Daisy', price: 28.00, category: 'Daisies', image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=500', rating: 4.4 },
];

const CATEGORIES = [
  { name: 'Roses', icon: FaHeart, count: 24, color: '#ef4444' },
  { name: 'Orchids', icon: FaStar, count: 18, color: '#f59e0b' },
  { name: 'Lilies', icon: FaLeaf, count: 15, color: '#10b981' },
  { name: 'Gift Sets', icon: FaGift, count: 12, color: '#3b82f6' },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`${styles.container} ${loaded ? styles.loaded : ''}`}>

      {/* Decorative Background Elements */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <FaLeaf className={styles.tagIcon} />
            <span>Handcrafted Nature</span>
          </div>
          <h1 className={styles.heroTitle}>
            Bring the <span className={styles.highlight}>Garden</span> Inside.
          </h1>
          <p className={styles.heroSubtitle}>
            Timeless glass flowers that never fade. Meticulously handcrafted to capture the delicate beauty of nature in eternal crystal form.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/shop">
              <button className={styles.primaryBtn}>
                Explore Collection <FaArrowRight />
              </button>
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h3>2k+</h3>
              <p>Happy Homes</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <h3>500+</h3>
              <p>Unique Designs</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <h3>4.9</h3>
              <p>Star Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Curated Collections</h2>
          <Link href="/shop" className={styles.seeAll}>View All</Link>
        </div>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/shop?category=${cat.name}`} className={styles.categoryCard} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={styles.categoryIcon} style={{ color: cat.color, background: `${cat.color}15` }}>
                  <Icon />
                </div>
                <div>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <span className={styles.categoryCount}>{cat.count} Items</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionTag}>Best Sellers</span>
            <h2 className={styles.sectionTitle}>Featured Blooms</h2>
          </div>
        </div>
        <div className={styles.productGrid}>
          {FEATURED_PRODUCTS.map((product) => (
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
      </section>

      {/* Promotional Banner */}
      <section className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <h2>Custom Arrangements</h2>
          <p>For weddings, events, or just a special gift. tailored to your vision.</p>
          <button className={styles.whiteBtn}>Book Consultation</button>
        </div>
        <div className={styles.promoDecor}></div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionTag}>Fresh from Kiln</span>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
          </div>
        </div>
        <div className={styles.productGrid}>
          {NEW_ARRIVALS.map((product) => (
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
      </section>

    </div>
  );
}
