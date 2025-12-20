import React from 'react';
import styles from './GlobalLoader.module.css';

interface GlobalLoaderProps {
    fullScreen?: boolean;
    text?: string;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ fullScreen = false, text = 'Loading...' }) => {
    return (
        <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}>
            <div className={styles.glassCard}>
                <div className={styles.spinner}>
                    <div className={styles.petal}></div>
                    <div className={styles.petal}></div>
                    <div className={styles.petal}></div>
                    <div className={styles.petal}></div>
                    <div className={styles.petal}></div>
                </div>
                {text && <div className={styles.text}>{text}</div>}
            </div>
        </div>
    );
};

export default GlobalLoader;
