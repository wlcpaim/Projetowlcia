export type Company = {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  created_at?: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  category_id: string;
  company_id: string;
  created_at?: string;
};

export type SaleItem = {
  id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type Sale = {
  id: string;
  code: string;
  total: number;
  discount: number;
  payment_method: 'cash' | 'pix' | 'credit' | 'debit';
  customer_id?: string;
  items: SaleItem[];
  created_at: string;
  company_id: string;
};

export type CashRegister = {
  id: string;
  opening_amount: number;
  current_amount: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  company_id: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  credit_limit: number;
  company_id: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  company_id: string;
};

export type FinancialTransaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  company_id: string;
};