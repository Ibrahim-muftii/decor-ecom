import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const {
            category,
            minPrice,
            maxPrice,
            color,
            sort = 'newest',
            page = '1',
            limit = '12',
            featured,
        } = req.query;

        let query = supabase.from('products').select('*', { count: 'exact' });

        // Category Filter
        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        // Price Filters
        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice as string));
        }
        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice as string));
        }

        // Color Filter (check if color is in the colors array)
        if (color) {
            query = query.contains('colors', [color]);
        }

        // Featured Filter
        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }

        // Sorting
        switch (sort) {
            case 'price-asc':
                query = query.order('price', { ascending: true });
                break;
            case 'price-desc':
                query = query.order('price', { ascending: false });
                break;
            case 'rating':
                query = query.order('rating', { ascending: false });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        // Pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        query = query.range(offset, offset + limitNum - 1);

        const { data, error, count } = await query;

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({
            products: data,
            total: count,
            page: pageNum,
            totalPages: count ? Math.ceil(count / limitNum) : 0,
        });
    }

    if (req.method === 'POST') {
        const {
            name,
            price,
            discount_price,
            description,
            category,
            image_url,
            stock,
            colors,
            bunches_available,
            rating,
            additional_info,
            is_featured,
        } = req.body;

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                price,
                discount_price,
                description,
                category,
                image_url,
                stock,
                colors,
                bunches_available,
                rating: rating || 0,
                additional_info: additional_info || {},
                is_featured: is_featured || false,
            }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
