import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { user_id, total_price, status = 'Pending' } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .insert([{ user_id, total_price, status }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    if (req.method === 'GET') {
        const { user_id } = req.query;
        let query = supabase.from('orders').select('*');

        if (user_id) {
            query = query.eq('user_id', user_id);
        }

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
