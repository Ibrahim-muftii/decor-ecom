import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
        : 'http://localhost:3000';

    // 1. Core Pages (High Priority)
    const coreRoutes = [
        { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
        { url: `${baseUrl}/shop`, priority: 0.9, changeFrequency: 'daily' },
        { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'yearly' },
    ];

    // 2. Category Pages (Important Landing Pages)
    // Hardcoded based on current business inventory logic
    const categories = ['Roses', 'Orchids', 'Lilies', 'Gift Sets'];
    const categoryRoutes = categories.map(cat => ({
        url: `${baseUrl}/shop?category=${encodeURIComponent(cat)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Policy & Support Pages (Essential for Trust)
    const policyRoutes = [
        '/privacy',
        '/terms',
        '/shipping',
        '/faq',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }));

    // 4. Dynamic Product Pages (The Inventory)
    const { data: products } = await supabase
        .from('products')
        .select('id, created_at');

    const productRoutes = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    const finalRoutes = [
        ...coreRoutes.map(r => ({
            url: r.url,
            lastModified: new Date(),
            changeFrequency: r.changeFrequency as any,
            priority: r.priority
        })),
        ...categoryRoutes,
        ...policyRoutes,
        ...productRoutes
    ];

    return finalRoutes;
}
