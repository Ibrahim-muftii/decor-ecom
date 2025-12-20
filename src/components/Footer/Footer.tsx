import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP, FaPaperPlane, FaLeaf } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Background Decoration */}
            <div className={`${styles.leaf} ${styles.leaf1}`}>
                <FaLeaf />
            </div>

            <div className={styles.container}>
                {/* Brand Column */}
                <div className={styles.column}>
                    <div className={styles.logoArea}>
                        <h2 className={styles.logo}>GlassFlowers</h2>
                        <p className={styles.description}>
                            Premium handcrafted glass botanicals to elevate your living space.
                            Sustainable, timeless, and uniquely beautiful.
                        </p>
                    </div>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon}><FaInstagram /></a>
                        <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
                        <a href="#" className={styles.socialIcon}><FaPinterestP /></a>
                        <a href="#" className={styles.socialIcon}><FaTwitter /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.column}>
                    <h3 className={styles.title}>Shop</h3>
                    <div className={styles.links}>
                        <Link href="/shop?category=Roses" className={styles.link}>Roses</Link>
                        <Link href="/shop?category=Orchids" className={styles.link}>Orchids</Link>
                        <Link href="/shop?category=Lilies" className={styles.link}>Lilies</Link>
                        <Link href="/shop?category=Gift Sets" className={styles.link}>Gift Sets</Link>
                        <Link href="/shop" className={styles.link}>All Products</Link>
                    </div>
                </div>

                {/* Support */}
                <div className={styles.column}>
                    <h3 className={styles.title}>Support</h3>
                    <div className={styles.links}>
                        <Link href="/contact" className={styles.link}>Contact Us</Link>
                        <Link href="/shipping" className={styles.link}>Shipping & Returns</Link>
                        <Link href="/faq" className={styles.link}>FAQ</Link>
                        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.link}>Terms of Service</Link>
                    </div>
                </div>

                {/* Newsletter */}
                <div className={styles.column}>
                    <h3 className={styles.title}>Stay in Bloom</h3>
                    <p className={styles.description}>
                        Subscribe to our newsletter for exclusive offers and new arrivals.
                    </p>
                    <div className={styles.newsletterInputContainer}>
                        <input type="email" placeholder="Your email address" className={styles.input} />
                        <button className={styles.subscribeBtn}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.container} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', border: 'none', padding: 0 }}>
                    <p>&copy; {new Date().getFullYear()} GlassFarmers. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>Made with <FaLeaf style={{ display: 'inline', color: '#10b981' }} /> in Nature</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
