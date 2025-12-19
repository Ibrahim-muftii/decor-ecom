import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Assuming user_id is passed or handled via token/session in real app
    // For simplicity, we just look at basic CRUD logic structure

    if (req.method === 'GET') {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

        const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user_id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { user_id, product_id, quantity } = req.body;
        const { data, error } = await supabase
            .from('cart_items')
            .insert([{ user_id, product_id, quantity }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    // DELETE, PUT handling...

    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
