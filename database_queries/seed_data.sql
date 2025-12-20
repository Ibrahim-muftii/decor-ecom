-- ==============================================================================
-- SEED DATA SCRIPT
-- WARNING: This will DELETE all existing products!
-- Run this in Supabase SQL Editor.
-- ==============================================================================

-- 1. Clear existing product data
truncate table products cascade;

-- 2. Insert Real Glass Flower Products
insert into products (name, description, price, discount_price, category, image_url, stock, colors, bunches_available, rating, is_featured)
values
  (
    'Golden Crystal Orchid',
    'A stunning hand-blown glass orchid with gold-leaf accents. Perfect for a timeless centerpiece.',
    120.00,
    105.00,
    'Orchids',
    'https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&q=80&w=800',
    50,
    ARRAY['Gold', 'Clear', 'Amber'],
    ARRAY[6, 12],
    4.9,
    true
  ),
  (
    'Ruby Red Glass Rose',
    'Deep red crystal rose petals that shimmer in the light. A romantic gift that lasts forever.',
    45.00,
    null,
    'Roses',
    'https://images.unsplash.com/photo-1548602088-9d12a4f9c10d?auto=format&fit=crop&q=80&w=800',
    100,
    ARRAY['Ruby Red', 'Pink', 'White'],
    ARRAY[1, 6, 12, 24],
    4.8,
    true
  ),
  (
    'Sapphire Blue Lily',
    'Delicate blue glass lily with intricate stamens. Captures the serenity of a cool morning.',
    55.00,
    49.99,
    'Lilies',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    30,
    ARRAY['Sapphire', 'Sky Blue'],
    ARRAY[6, 12],
    4.7,
    true
  ),
  (
    'Midnight Tulip Collection',
    'Dark purple, almost black glass tulips. Modern, sleek, and mysteriously beautiful.',
    35.00,
    null,
    'Tulips',
    'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=800',
    45,
    ARRAY['Midnight Purple', 'Black', 'Wine'],
    ARRAY[6, 12, 18],
    4.6,
    false
  ),
  (
    'Frosted Peony Bowl',
    'Large, lush glass peony blooms with a frosted finish. Soft, romantic, and voluminous.',
    89.99,
    null,
    'Peonies',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
    20,
    ARRAY['Soft Pink', 'Cream', 'Peach'],
    ARRAY[1],
    4.9,
    true
  ),
  (
    'Sunlit Glass Daisy',
    'Cheerful yellow and white glass daisies. Brings a burst of sunshine to any room.',
    25.00,
    19.99,
    'Daisies',
    'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=800',
    150,
    ARRAY['Yellow', 'White'],
    ARRAY[6, 12, 24],
    4.5,
    false
  ),
  (
    'Mixed Wildflower Bouquet',
    'A vibrant assortment of glass wildflowers. An explosion of color and craftsmanship.',
    150.00,
    129.50,
    'Mixed',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    15,
    ARRAY['Multicolor'],
    ARRAY[1],
    5.0,
    true
  ),
  (
    'Emerald Fern Leaves',
    'Not a flower, but elegant glass fern fronds. Perfect for adding greenery to an arrangement.',
    18.00,
    null,
    'Mixed',
    'https://images.unsplash.com/photo-1596525732159-0750523f46f3?auto=format&fit=crop&q=80&w=800',
    200,
    ARRAY['Emerald', 'Lime', 'Olive'],
    ARRAY[3, 6],
    4.3,
    false
  ),
  (
    'Crystal Lotus Tea Light',
    'A functionality meeting art. A glass lotus that holds a tea light candle.',
    30.00,
    null,
    'Mixed',
    'https://images.unsplash.com/photo-1516205651411-a416745265dd?auto=format&fit=crop&q=80&w=800',
    80,
    ARRAY['Pink', 'Clear', 'Purple'],
    ARRAY[1],
    4.8,
    false
  ),
  (
    'Lavender Sprigs',
    'Delicate purple glass beads forming lavender sprigs. Simple and elegant.',
    22.50,
    null,
    'Mixed',
    'https://images.unsplash.com/photo-1468327768560-75b7b640f1a7?auto=format&fit=crop&q=80&w=800',
    100,
    ARRAY['Lavender'],
    ARRAY[6, 12],
    4.6,
    false
  );

-- 3. Setup Super Admin
-- NOTE: This will update the user if they exist, or do nothing.
-- You MUST sign up with 'ibrahimmufti1289@gmail.com' manually first!

update profiles
set role = 'admin'
where email = 'ibrahimmufti1289@gmail.com';

-- Just in case the profile exists but email wasn't synced (rare)
-- or to verify the text, we can also query auth.users if needed, 
-- but profiles should be the source of truth for role.
