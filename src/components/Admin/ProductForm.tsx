'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaTimes, FaPlus, FaSave } from 'react-icons/fa';
import GlassInput from '@/components/GlassInput/GlassInput';
import GlassButton from '@/components/GlassButton/GlassButton';
import Image from 'next/image';
import styles from './ProductForm.module.css';

interface ProductFormProps {
    editProduct?: any | null;
    onSuccess: () => void;
}

const CATEGORIES = ['Roses', 'Orchids', 'Lilies', 'Tulips', 'Peonies', 'Daisies', 'Mixed'];

const ProductForm: React.FC<ProductFormProps> = ({ editProduct, onSuccess }) => {
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
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Populate form if Edit Mode
    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || '',
                category: editProduct.category || '',
                price: editProduct.price?.toString() || '',
                discountPrice: editProduct.discount_price?.toString() || '',
                stock: editProduct.stock?.toString() || '',
                description: editProduct.description || '',
                colors: editProduct.colors && editProduct.colors.length > 0 ? editProduct.colors : [''],
                bunches: ['6', '12', '24'], // Keep default options
                additionalInfo: editProduct.additional_info ?
                    Object.entries(editProduct.additional_info).map(([key, value]) => ({ key, value: String(value) }))
                    : [{ key: '', value: '' }],
            });
            setUploadedUrl(editProduct.image_url || '');
            setImagePreview(editProduct.image_url || null);
        } else {
            resetForm();
        }
    }, [editProduct]);

    const resetForm = () => {
        setFormData({
            name: '', category: '', price: '', discountPrice: '', stock: '', description: '',
            colors: [''], bunches: ['6', '12', '24'], additionalInfo: [{ key: '', value: '' }],
        });
        setImagePreview(null);
        setUploadedUrl('');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'colors', index: number, value: string) => {
        const newArr = [...formData[field]];
        newArr[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArr }));
    };

    const addArrayItem = (field: 'colors') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field: 'colors', index: number) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleInfoChange = (index: number, key: 'key' | 'value', val: string) => {
        const newInfo = [...formData.additionalInfo];
        newInfo[index] = { ...newInfo[index], [key]: val };
        setFormData(prev => ({ ...prev, additionalInfo: newInfo }));
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const base64 = await toBase64(file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 }),
            });
            const data = await res.json();
            if (data.url) setUploadedUrl(data.url);
            else toast.error('Upload failed');
        } catch (error) {
            toast.error('Image upload error');
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
        setLoading(true);

        const payload = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            stock: parseInt(formData.stock),
            description: formData.description,
            colors: formData.colors.filter(c => c.trim() !== ''),
            bunches_available: [6, 12, 24],
            additional_info: Object.fromEntries(formData.additionalInfo.filter(i => i.key).map(i => [i.key, i.value])),
            image_url: uploadedUrl,
        };

        let error;
        if (editProduct) {
            const { error: err } = await supabase.from('products').update(payload).eq('id', editProduct.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('products').insert([payload]);
            error = err;
        }

        if (error) {
            toast.error(editProduct ? 'Failed to update product' : 'Failed to add product');
        } else {
            toast.success(editProduct ? 'Product Updated!' : 'Product Added!');
            if (!editProduct) resetForm(); // Only reset if adding new
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {editProduct ? `Edit Product: ${editProduct.name}` : 'Add New Product'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <GlassInput placeholder="Product Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />

                <select
                    className={styles.select}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <div className={styles.row}>
                    <GlassInput placeholder="Price" type="number" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                    <GlassInput placeholder="Discount Price" type="number" value={formData.discountPrice} onChange={(e) => handleInputChange('discountPrice', e.target.value)} />
                </div>

                <GlassInput placeholder="Stock Quantity" type="number" value={formData.stock} onChange={(e) => handleInputChange('stock', e.target.value)} />

                <textarea
                    className={styles.textarea}
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />

                {/* Colors */}
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>Colors</label>
                    {formData.colors.map((color, i) => (
                        <div key={i} className={styles.dynamicRow}>
                            <GlassInput placeholder={`Color ${i + 1}`} value={color} onChange={(e) => handleArrayChange('colors', i, e.target.value)} />
                            {formData.colors.length > 1 && (
                                <button type="button" onClick={() => removeArrayItem('colors', i)} className={styles.removeBtn}>
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('colors')} className={styles.addBtn}>
                        <FaPlus /> Add Color
                    </button>
                </div>

                {/* Info */}
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>Additional Info</label>
                    {formData.additionalInfo.map((info, i) => (
                        <div key={i} className={styles.dynamicRow}>
                            <GlassInput placeholder="Key" value={info.key} onChange={(e) => handleInfoChange(i, 'key', e.target.value)} />
                            <GlassInput placeholder="Value" value={info.value} onChange={(e) => handleInfoChange(i, 'value', e.target.value)} />
                        </div>
                    ))}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, additionalInfo: [...p.additionalInfo, { key: '', value: '' }] }))} className={styles.addBtn}>
                        <FaPlus /> Add Info
                    </button>
                </div>

                {/* Image */}
                <div
                    className={styles.uploadArea}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <>
                            <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                            {uploading && <div className={styles.uploadingOverlay}>Uploading...</div>}
                        </>
                    ) : (
                        <div className={styles.uploadPlaceholder}>
                            <FaCloudUploadAlt size={32} />
                            <p>Upload Image</p>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageSelect} />
                </div>

                <GlassButton fullWidth variant="accent" type="submit" disabled={loading || uploading}>
                    <FaSave style={{ marginRight: '8px' }} /> {loading ? 'Saving...' : 'Save Product'}
                </GlassButton>
            </form>
        </div>
    );
};

export default ProductForm;
