-- Schema DDL para Supabase (PostgreSQL)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'Pro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  credit_limit NUMERIC(10,2) DEFAULT 0,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- SEED INICIAL
INSERT INTO companies (id, name, cnpj, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Owlcia Matriz Demo', '12.345.678/0001-99', 'Enterprise')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, sku, price, cost, stock, company_id)
VALUES 
('p1', 'Café Espresso Gourmet 250g', '7891001', 24.90, 12.00, 45, '00000000-0000-0000-0000-000000000001'),
('p2', 'Pão de Queijo Artesanal 1kg', '7891002', 32.50, 15.00, 30, '00000000-0000-0000-0000-000000000001'),
('p3', 'Suco de Laranja Natural 500ml', '7891003', 8.00, 3.50, 60, '00000000-0000-0000-0000-000000000001'),
('p4', 'Bolo de Chocolate Belga', '7891004', 55.00, 25.00, 12, '00000000-0000-0000-0000-000000000001'),
('p5', 'Água Mineral sem Gás 500ml', '7891005', 4.50, 1.80, 120, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
