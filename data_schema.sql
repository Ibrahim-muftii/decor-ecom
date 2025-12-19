-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table (Enhanced)
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric not null,
  discount_price numeric, -- Discounted price (nullable)
  category text,
  image_url text,
  stock int default 0,
  colors text[] default '{}', -- Available colors array
  bunches_available int[] default '{6, 12, 24}', -- Bunch quantity options
  rating numeric default 0, -- Product rating (0-5)
  additional_info jsonb default '{}', -- Flexible additional info
  is_featured boolean default false, -- For featured products section
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Cart Items Table
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  product_id uuid references products(id) not null,
  quantity int default 1,
  selected_color text, -- User's color choice
  selected_bunches int default 6 -- User's bunch quantity
);

-- Orders Table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  total_price numeric not null,
  status text default 'Pending',
  shipping_address jsonb, -- Store shipping details
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Order Items Table (New - for order line items)
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  quantity int not null,
  price numeric not null,
  selected_color text,
  selected_bunches int
);

-- Security Policies (RLS)
alter table products enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: Public read
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Cart: User-specific access
create policy "Users can view their own cart"
  on cart_items for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own cart"
  on cart_items for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own cart"
  on cart_items for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own cart"
  on cart_items for delete
  using ( auth.uid() = user_id );

-- Orders: User-specific access
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders"
  on orders for insert
  with check ( auth.uid() = user_id );

-- Order Items: Linked to user's orders
create policy "Users can view their order items"
  on order_items for select
  using ( 
    exists (
      select 1 from orders 
      where orders.id = order_items.order_id 
      and orders.user_id = auth.uid()
    ) 
  );
