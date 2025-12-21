import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

export async function addToCart(productId: string, quantity: number = 1) {
    console.log('addToCart called:', { productId, quantity });
    try {
        // Use getSession for better client-side reliability
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Session error:', sessionError);
            toast.error('Authentication error. Please login again.');
            return false;
        }

        if (!session?.user) {
            console.log('No user session found');
            toast.error('Please login to add items to cart');
            return false;
        }

        const user = session.user;
        console.log('User found:', user.id);

        // Check if item exists
        const { data: existing, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .maybeSingle(); // Use maybeSingle to avoid 406 on no rows

        if (fetchError) {
            console.error('Error checking existing cart item:', fetchError);
            throw fetchError;
        }

        if (existing) {
            console.log('Updating existing item:', existing.id);
            const { error: updateError } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id);

            if (updateError) {
                console.error('Error updating item:', updateError);
                throw updateError;
            }
        } else {
            console.log('Inserting new item');
            const { error: insertError } = await supabase
                .from('cart_items')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity: quantity
                });

            if (insertError) {
                console.error('Error inserting item:', insertError);
                throw insertError;
            }
        }

        toast.success('Added to cart!');
        console.log('Cart update successful');
        return true;
    } catch (error: any) {
        console.error('Add to cart fatal error:', error);
        toast.error(`Failed to add to cart: ${error.message || 'Unknown error'} `);
        return false;
    }
}
