import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Note: RLS policies in Supabase handle authorization checks on the specific 'insert' operation
        // based on the auth token passed in headers/cookies. 
        // However, for server-side operations using the anon key, RLS is applied if enabled.
        // Ideally, we forward the user's session or use a service role key if we were doing admin tasks bypassing RLS.
        // Since we are using the anon key here, the client MUST send the user's auth token in the request headers 
        // if we were strictly proxying.
        // But simpler for this migration: We rely on the frontend passing the data to Supabase DIRECTLY for inserts 
        // (as seen in the Admin page currently).
        // If this route is intended for server-side usage, we'd need to handle auth.

        // Given current Admin page implementation does: supabase.from('products').insert(...) client-side,
        // this API route might assume similar or be a redundant path. 
        // Let's implement it as a standard wrapper.

        const { error } = await supabase.from('products').insert([body]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
