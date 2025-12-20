import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';
import ProductDetailsClient from '../ProductDetailsClient';
import ProductCard from '@/components/ProductCard/ProductCard';

// Using server component params
export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Product
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) {
        return <div className={styles.error} style={{ textAlign: 'center', padding: '4rem' }}>Product not found</div>;
    }

    // Fetch Related
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', id)
        .limit(3);

    return (
        <div className={styles.container}>
            <ProductDetailsClient product={product} relatedProducts={relatedProducts || []} />

            {/* Render Related Products here or inside Client? 
                 Rendering here keeps them "SSR" but the layout is shared.
                 I'll render them here so they are interactive links immediately.
             */}
            {relatedProducts && relatedProducts.length > 0 && (
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
                                discountPrice={p.discount_price}
                                image_url={p.image_url}
                                rating={p.rating}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
