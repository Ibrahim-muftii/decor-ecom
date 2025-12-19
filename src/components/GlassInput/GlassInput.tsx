import React from 'react';
import styles from './GlassInput.module.css';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const GlassInput: React.FC<GlassInputProps> = ({ label, className, ...props }) => {
    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={`${styles.input} ${className || ''}`}
                {...props}
            />
        </div>
    );
};

export default GlassInput;
