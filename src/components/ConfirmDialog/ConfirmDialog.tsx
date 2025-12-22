'use client';

import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import GlassButton from '../GlassButton/GlassButton';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'warning' | 'danger' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title = 'Confirmation',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'warning'
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className={styles.dialogBg}>
            <div className={styles.backdrop} onClick={handleBackdropClick}>
                <div className={styles.dialog}>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        <FaTimes />
                    </button>

                    <div className={`${styles.iconWrapper} ${styles[variant]}`}>
                        <FaExclamationTriangle />
                    </div>

                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>

                    <div className={styles.actions}>
                        <GlassButton
                            onClick={onCancel}
                            variant="secondary"
                            fullWidth
                        >
                            {cancelText}
                        </GlassButton>
                        <GlassButton
                            onClick={onConfirm}
                            variant={variant === 'danger' ? 'primary' : 'accent'}
                            fullWidth
                        >
                            {confirmText}
                        </GlassButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
