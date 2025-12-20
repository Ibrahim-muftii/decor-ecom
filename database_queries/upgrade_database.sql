-- ==============================================================================
-- DATABASE UPGRADE SCRIPT
-- Run this in your Supabase SQL Editor to upgrade your existing database.
-- ==============================================================================

-- 1. Upgrade Products Table
-- Adding columns needed for the new UI and functionality
alter table products 
add column if not exists discount_price numeric,
add column if not exists colors text[] default '{}',
add column if not exists bunches_available int[] default '{6, 12, 24}',
add column if not exists rating numeric default 0,
add column if not exists additional_info jsonb default '{}',
add column if not exists is_featured boolean default false;

-- 2. Upgrade Cart Items Table
alter table cart_items
add column if not exists selected_color text,
add column if not exists selected_bunches int default 6;

-- 3. Upgrade Orders Table
alter table orders
add column if not exists shipping_address jsonb;

-- 4. Create Order Items Table (New)
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  quantity int not null,
  price numeric not null,
  selected_color text,
  selected_bunches int
);

alter table order_items enable row level security;

-- 5. Create Profiles Table & Trigger (For Auth/Roles)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table profiles enable row level security;

-- Trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Update Security Policies (RLS)

-- Profiles: Public read (for checking roles), Self update
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- Products: Admin Only Write
drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products" on products for insert with check ( exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin') );

drop policy if exists "Admins can update products" on products;
create policy "Admins can update products" on products for update using ( exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin') );

drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products" on products for delete using ( exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin') );

-- Orders: Admin View All
-- First drop the old basic policy
drop policy if exists "Users can view their own orders" on orders;

-- Add new policy allowing Admins to see everything
create policy "Users can view own orders, Admins view all" on orders for select using ( auth.uid() = user_id or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin') );

drop policy if exists "Admins can update order status" on orders;
create policy "Admins can update order status" on orders for update using ( exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin') );

-- Order Items
drop policy if exists "Users can view their order items" on order_items;
create policy "Users can view their order items" on order_items for select using ( 
    exists (
      select 1 from orders 
      where orders.id = order_items.order_id 
      and (orders.user_id = auth.uid() or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
    ) 
);
