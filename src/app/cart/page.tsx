import React from 'react';
import CartClient from './CartClient';

export const metadata = {
    title: 'Shopping Cart | GlassFlowers',
    description: 'Review your selected items.',
};

export const dynamic = 'force-dynamic';

export default function CartPage() {
    return <CartClient />;
}
