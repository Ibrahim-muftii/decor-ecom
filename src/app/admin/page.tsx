'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTimes, FaPlus } from 'react-icons/fa';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import styles from './page.module.css';

const CATEGORIES = ['Roses', 'Orchids', 'Lilies', 'Tulips', 'Peonies', 'Daisies'];

export default function Admin() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discountPrice: '',
        stock: '',
        description: '',
        colors: [''],
        bunches: ['6', '12', '24'],
        additionalInfo: [{ key: '', value: '' }],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleColorChange = (index: number, value: string) => {
        const newColors = [...formData.colors];
        newColors[index] = value;
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColor = () => {
        setFormData(prev => ({ ...prev, colors: [...prev.colors, ''] }));
    };

    const removeColor = (index: number) => {
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const handleInfoChange = (index: number, field: 'key' | 'value', val: string) => {
        const newInfo = [...formData.additionalInfo];
        newInfo[index][field] = val;
        setFormData(prev => ({ ...prev, additionalInfo: newInfo }));
    };

    const addInfoRow = () => {
        setFormData(prev => ({
            ...prev,
            additionalInfo: [...prev.additionalInfo, { key: '', value: '' }]
        }));
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        try {
            const base64 = await toBase64(file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });
            const data = await res.json();
            if (data.url) {
                setUploadedUrl(data.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            stock: parseInt(formData.stock),
            image_url: uploadedUrl,
            bunches_available: formData.bunches.map(b => parseInt(b)),
            additional_info: Object.fromEntries(
                formData.additionalInfo.filter(i => i.key).map(i => [i.key, i.value])
            ),
        };

        console.log('Product Data:', productData);
        // TODO: Submit to API
        alert('Product saved! (Check console for data)');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>

            <div className={styles.grid}>
                {/* Add Product Form */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Add New Product</h2>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Basic Info */}
                        <GlassInput
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />

                        <select
                            className={styles.select}
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <div className={styles.row}>
                            <GlassInput
                                placeholder="Price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                            />
                            <GlassInput
                                placeholder="Discount Price (optional)"
                                type="number"
                                value={formData.discountPrice}
                                onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                            />
                        </div>

                        <GlassInput
                            placeholder="Stock Quantity"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleInputChange('stock', e.target.value)}
                        />

                        <textarea
                            className={styles.textarea}
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />

                        {/* Colors */}
                        <div className={styles.dynamicSection}>
                            <label className={styles.label}>Available Colors</label>
                            {formData.colors.map((color, i) => (
                                <div key={i} className={styles.dynamicRow}>
                                    <GlassInput
                                        placeholder={`Color ${i + 1}`}
                                        value={color}
                                        onChange={(e) => handleColorChange(i, e.target.value)}
                                    />
                                    {formData.colors.length > 1 && (
                                        <button type="button" className={styles.removeBtn} onClick={() => removeColor(i)}>
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className={styles.addBtn} onClick={addColor}>
                                <FaPlus /> Add Color
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className={styles.dynamicSection}>
                            <label className={styles.label}>Additional Information</label>
                            {formData.additionalInfo.map((info, i) => (
                                <div key={i} className={styles.row}>
                                    <GlassInput
                                        placeholder="Key (e.g., Material)"
                                        value={info.key}
                                        onChange={(e) => handleInfoChange(i, 'key', e.target.value)}
                                    />
                                    <GlassInput
                                        placeholder="Value (e.g., Crystal)"
                                        value={info.value}
                                        onChange={(e) => handleInfoChange(i, 'value', e.target.value)}
                                    />
                                </div>
                            ))}
                            <button type="button" className={styles.addBtn} onClick={addInfoRow}>
                                <FaPlus /> Add Info
                            </button>
                        </div>

                        {/* Image Upload */}
                        <div className={styles.imageUpload}>
                            <label className={styles.label}>Product Image</label>
                            <div
                                className={styles.dropzone}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <div className={styles.preview}>
                                        <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                                        {uploading && <div className={styles.uploadingOverlay}>Uploading...</div>}
                                    </div>
                                ) : (
                                    <div className={styles.dropzoneContent}>
                                        <FaCloudUploadAlt className={styles.uploadIcon} />
                                        <p>Click to upload image</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className={styles.hiddenInput}
                            />
                            {uploadedUrl && (
                                <p className={styles.uploadSuccess}>✓ Image uploaded successfully</p>
                            )}
                        </div>

                        <GlassButton fullWidth variant="accent" type="submit">
                            Add Product
                        </GlassButton>
                    </form>
                </div>

                {/* Recent Orders */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Recent Orders</h2>
                    <p className={styles.placeholder}>No orders yet...</p>
                </div>
            </div>
        </div>
    );
}
