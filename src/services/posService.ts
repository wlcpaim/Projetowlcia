import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DB_STORAGE_KEY, DEFAULT_COMPANY_ID } from '../lib/constants';
import { Product, Sale, CashRegister, Customer, Supplier, Company, FinancialTransaction } from '../types';

interface LocalDB {
  companies: Company[];
  products: Product[];
  sales: Sale[];
  cash_registers: CashRegister[];
  customers: Customer[];
  suppliers: Supplier[];
  financial_transactions: FinancialTransaction[];
}

const initialSeed: LocalDB = {
  companies: [
    { id: DEFAULT_COMPANY_ID, name: 'Owlcia Demo Store', cnpj: '12.345.678/0001-99', plan: 'Enterprise' },
    { id: 'comp-demo-02', name: 'Owlcia Filial Norte', cnpj: '98.765.432/0001-11', plan: 'Pro' }
  ],
  products: [
    { id: 'p1', name: 'Café Espresso Gourmet 250g', sku: '7891001', price: 24.90, cost: 12.00, stock: 45, category_id: 'c1', company_id: DEFAULT_COMPANY_ID },
    { id: 'p2', name: 'Pão de Queijo Artesanal 1kg', sku: '7891002', price: 32.50, cost: 15.00, stock: 30, category_id: 'c1', company_id: DEFAULT_COMPANY_ID },
    { id: 'p3', name: 'Suco de Laranja Natural 500ml', sku: '7891003', price: 8.00, cost: 3.50, stock: 60, category_id: 'c2', company_id: DEFAULT_COMPANY_ID },
    { id: 'p4', name: 'Bolo de Chocolate Belga', sku: '7891004', price: 55.00, cost: 25.00, stock: 12, category_id: 'c2', company_id: DEFAULT_COMPANY_ID },
    { id: 'p5', name: 'Água Mineral sem Gás 500ml', sku: '7891005', price: 4.50, cost: 1.80, stock: 120, category_id: 'c2', company_id: DEFAULT_COMPANY_ID }
  ],
  sales: [
    {
      id: 's1',
      code: 'VD-1001',
      total: 57.40,
      discount: 0,
      payment_method: 'pix',
      items: [
        { product_id: 'p1', product_name: 'Café Espresso Gourmet 250g', quantity: 1, unit_price: 24.90, subtotal: 24.90 },
        { product_id: 'p3', product_name: 'Suco de Laranja Natural 500ml', quantity: 4, unit_price: 8.00, subtotal: 32.50 }
      ],
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      company_id: DEFAULT_COMPANY_ID
    }
  ],
  cash_registers: [
    {
      id: 'cr1',
      opening_amount: 300.00,
      current_amount: 357.40,
      status: 'open',
      opened_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      company_id: DEFAULT_COMPANY_ID
    }
  ],
  customers: [
    { id: 'cust-1', name: 'Ana Souza', phone: '(11) 98765-4321', email: 'ana@email.com', credit_limit: 1000, company_id: DEFAULT_COMPANY_ID },
    { id: 'cust-2', name: 'Carlos Lima', phone: '(11) 91234-5678', email: 'carlos@email.com', credit_limit: 500, company_id: DEFAULT_COMPANY_ID }
  ],
  suppliers: [
    { id: 'sup-1', name: 'Distribuidora CafeBr', contact: 'Marcos (11) 3333-4444', email: 'vendas@cafebr.com', company_id: DEFAULT_COMPANY_ID }
  ],
  financial_transactions: [
    { id: 'ft-1', type: 'income', amount: 357.40, description: 'Vendas do Turno', date: new Date().toISOString(), company_id: DEFAULT_COMPANY_ID }
  ]
};

function getLocalStore(): LocalDB {
  const raw = localStorage.getItem(DB_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(initialSeed));
    return initialSeed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initialSeed;
  }
}

function saveLocalStore(db: LocalDB) {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

export async function getProducts(companyId: string = DEFAULT_COMPANY_ID): Promise<Product[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('products').select('*').eq('company_id', companyId);
    if (!error && data) return data as Product[];
  }
  const db = getLocalStore();
  return db.products.filter(p => p.company_id === companyId);
}

export async function saveProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const id = product.id || 'p-' + Math.random().toString(36).substring(2, 9);
  const fullProduct: Product = { ...product, id, created_at: product.created_at || new Date().toISOString() };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('products').upsert(fullProduct).select().single();
    if (!error && data) return data as Product;
  }

  const db = getLocalStore();
  const idx = db.products.findIndex(p => p.id === id);
  if (idx >= 0) {
    db.products[idx] = fullProduct;
  } else {
    db.products.push(fullProduct);
  }
  saveLocalStore(db);
  return fullProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('products').delete().eq('id', id);
    return;
  }
  const db = getLocalStore();
  db.products = db.products.filter(p => p.id !== id);
  saveLocalStore(db);
}

export async function getSales(companyId: string = DEFAULT_COMPANY_ID): Promise<Sale[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('sales').select('*, sale_items(*)').eq('company_id', companyId);
    if (!error && data) return data as Sale[];
  }
  const db = getLocalStore();
  return db.sales.filter(s => s.company_id === companyId);
}

export async function createSale(saleData: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
  const id = 's-' + Math.random().toString(36).substring(2, 9);
  const newSale: Sale = {
    ...saleData,
    id,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    await supabase.from('sales').insert([newSale]);
    for (const item of newSale.items) {
      await supabase.from('sale_items').insert([{ ...item, sale_id: id }]);
    }
    return newSale;
  }

  const db = getLocalStore();
  db.sales.unshift(newSale);

  // Update stock
  for (const item of newSale.items) {
    const prod = db.products.find(p => p.id === item.product_id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  // Update cash register if open
  const cr = db.cash_registers.find(c => c.company_id === newSale.company_id && c.status === 'open');
  if (cr) {
    cr.current_amount += newSale.total;
  }

  saveLocalStore(db);
  return newSale;
}

export async function getCashRegister(companyId: string = DEFAULT_COMPANY_ID): Promise<CashRegister | null> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('cash_registers').select('*').eq('company_id', companyId).eq('status', 'open').maybeSingle();
    if (data) return data as CashRegister;
  }
  const db = getLocalStore();
  return db.cash_registers.find(c => c.company_id === companyId && c.status === 'open') || null;
}

export async function openCashRegister(opening_amount: number, companyId: string = DEFAULT_COMPANY_ID): Promise<CashRegister> {
  const id = 'cr-' + Math.random().toString(36).substring(2, 9);
  const newCr: CashRegister = {
    id,
    opening_amount,
    current_amount: opening_amount,
    status: 'open',
    opened_at: new Date().toISOString(),
    company_id: companyId
  };

  if (isSupabaseConfigured) {
    const { data } = await supabase.from('cash_registers').insert([newCr]).select().single();
    if (data) return data as CashRegister;
  }

  const db = getLocalStore();
  db.cash_registers.push(newCr);
  saveLocalStore(db);
  return newCr;
}

export async function closeCashRegister(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('cash_registers').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', id);
    return;
  }
  const db = getLocalStore();
  const cr = db.cash_registers.find(c => c.id === id);
  if (cr) {
    cr.status = 'closed';
    cr.closed_at = new Date().toISOString();
  }
  saveLocalStore(db);
}

export async function getCustomers(companyId: string = DEFAULT_COMPANY_ID): Promise<Customer[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('customers').select('*').eq('company_id', companyId);
    if (data) return data as Customer[];
  }
  const db = getLocalStore();
  return db.customers.filter(c => c.company_id === companyId);
}

export async function saveCustomer(customer: Omit<Customer, 'id'> & { id?: string }): Promise<Customer> {
  const id = customer.id || 'cust-' + Math.random().toString(36).substring(2, 9);
  const full: Customer = { ...customer, id };
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('customers').upsert(full).select().single();
    if (data) return data as Customer;
  }
  const db = getLocalStore();
  const idx = db.customers.findIndex(c => c.id === id);
  if (idx >= 0) db.customers[idx] = full;
  else db.customers.push(full);
  saveLocalStore(db);
  return full;
}

export async function deleteCustomer(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('customers').delete().eq('id', id);
    return;
  }
  const db = getLocalStore();
  db.customers = db.customers.filter(c => c.id !== id);
  saveLocalStore(db);
}

export async function getSuppliers(companyId: string = DEFAULT_COMPANY_ID): Promise<Supplier[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('suppliers').select('*').eq('company_id', companyId);
    if (data) return data as Supplier[];
  }
  const db = getLocalStore();
  return db.suppliers.filter(s => s.company_id === companyId);
}

export async function saveSupplier(supplier: Omit<Supplier, 'id'> & { id?: string }): Promise<Supplier> {
  const id = supplier.id || 'sup-' + Math.random().toString(36).substring(2, 9);
  const full: Supplier = { ...supplier, id };
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('suppliers').upsert(full).select().single();
    if (data) return data as Supplier;
  }
  const db = getLocalStore();
  const idx = db.suppliers.findIndex(s => s.id === id);
  if (idx >= 0) db.suppliers[idx] = full;
  else db.suppliers.push(full);
  saveLocalStore(db);
  return full;
}

export async function deleteSupplier(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('suppliers').delete().eq('id', id);
    return;
  }
  const db = getLocalStore();
  db.suppliers = db.suppliers.filter(s => s.id !== id);
  saveLocalStore(db);
}

export async function getCompanies(): Promise<Company[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('companies').select('*');
    if (data) return data as Company[];
  }
  const db = getLocalStore();
  return db.companies;
}

export async function saveCompany(company: Company): Promise<Company> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('companies').upsert(company).select().single();
    if (data) return data as Company;
  }
  const db = getLocalStore();
  const idx = db.companies.findIndex(c => c.id === company.id);
  if (idx >= 0) db.companies[idx] = company;
  else db.companies.push(company);
  saveLocalStore(db);
  return company;
}