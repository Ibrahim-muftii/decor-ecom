
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.css';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    discount_price?: number;
    image_url: string;
}

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                fetchResults(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResults = async (searchQuery: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
                setShowResults(true);
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} ref={searchRef}>
            <div className={styles.inputWrapper}>
                <FaSearch className={styles.icon} />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Search for flowers..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim() === '') {
                            setShowResults(false);
                        }
                    }}
                    onFocus={() => {
                        if (results.length > 0 && query.trim() !== '') {
                            setShowResults(true);
                        }
                    }}
                />
                {loading && <div className={styles.loader}></div>}
            </div>

            {showResults && query.trim() !== '' && (
                <div className={styles.results}>
                    <div className={styles.resultsContainer}>
                        {results.length > 0 ? (
                            results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.id}`}
                                    className={styles.resultItem}
                                    onClick={() => setShowResults(false)}
                                >
                                    <img src={product.image_url} alt={product.name} className={styles.resultImage} onError={(e) => e.currentTarget.style.display = 'none'} />
                                    <div className={styles.resultInfo}>
                                        <div className={styles.resultName}>{product.name}</div>
                                        <div>
                                            {product.discount_price ? (
                                                <>
                                                    <span className={styles.resultPrice} style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                        ${product.discount_price.toLocaleString()}
                                                    </span>
                                                    <span className={styles.resultPrice} style={{ textDecoration: 'line-through', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                                        ${product.price.toLocaleString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={styles.resultPrice}>
                                                    ${product.price.toLocaleString()}
                                                </span>
                                            )}
                                            <span className={styles.resultCategory}>{product.category}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            !loading && <div className={styles.noResults}>No matches found for "{query}"</div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default SearchBar;
