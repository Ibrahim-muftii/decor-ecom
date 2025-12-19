import React from 'react';
import styles from './GlassButton.module.css';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    fullWidth?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default GlassButton;
