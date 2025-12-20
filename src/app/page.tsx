'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaLeaf, FaStar, FaGift, FaHeart, FaArrowRight } from 'react-icons/fa';
import GlassButton from '@/components/GlassButton/GlassButton';
import ProductCard from '@/components/ProductCard/ProductCard';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

const CATEGORIES = [
  { name: 'Roses', icon: FaHeart, count: 24, color: '#ef4444' },
  { name: 'Orchids', icon: FaStar, count: 18, color: '#f59e0b' },
  { name: 'Lilies', icon: FaLeaf, count: 15, color: '#10b981' },
  { name: 'Gift Sets', icon: FaGift, count: 12, color: '#3b82f6' },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    setLoaded(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    if (data) {
      // Filter for 'Featured' section
      const featured = data.filter((p: any) => p.is_featured);
      setFeaturedProducts(featured.slice(0, 3)); // Limit to 3 for layout

      // Valid 'New Arrivals' (excluding featured to avoid dupes on home, or just take latest 3)
      setNewArrivals(data.slice(0, 3));
    }
  };

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
                <div className={styles.categoryIcon}>
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
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              discountPrice={product.discount_price} // Note: db column is discount_price
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
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              discountPrice={product.discount_price}
              image_url={product.image_url}
              rating={product.rating}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
