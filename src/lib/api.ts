const API_URL = 'https://functions.poehali.dev/92a9d0d4-19af-4b3b-b619-8197c5c9bada';

export interface User {
  id: number;
  username: string;
  balance: number;
  is_bot: boolean;
  created_at: string;
}

export interface MarketplaceProduct {
  id: number;
  seller_id: number;
  seller_name: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  is_sold: boolean;
  created_at: string;
}

export interface RealEstate {
  id: number;
  seller_id: number;
  seller_name: string;
  title: string;
  price: number;
  address: string;
  rooms: number;
  area: number;
  description: string;
  image_url: string;
  is_sold: boolean;
  created_at: string;
}

export interface Deposit {
  id: number;
  user_id: number;
  deposit_name: string;
  amount: number;
  rate: number;
  term_months: number;
  created_at: string;
  expires_at: string;
}

export const api = {
  async getUser(userId: number): Promise<User> {
    const res = await fetch(`${API_URL}?path=user&user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to get user');
    return res.json();
  },

  async createUser(username: string): Promise<User> {
    const res = await fetch(`${API_URL}?path=user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  async updateBalance(userId: number, balance: number): Promise<void> {
    const res = await fetch(`${API_URL}?path=balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, balance })
    });
    if (!res.ok) throw new Error('Failed to update balance');
  },

  async getMarketplace(): Promise<MarketplaceProduct[]> {
    const res = await fetch(`${API_URL}?path=marketplace`);
    if (!res.ok) throw new Error('Failed to get marketplace');
    return res.json();
  },

  async createMarketplaceProduct(sellerId: number, name: string, price: number, description: string, imageUrl: string): Promise<MarketplaceProduct> {
    const res = await fetch(`${API_URL}?path=marketplace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_id: sellerId, name, price, description, image_url: imageUrl })
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async buyMarketplaceProduct(buyerId: number, productId: number): Promise<void> {
    const res = await fetch(`${API_URL}?path=marketplace/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyer_id: buyerId, product_id: productId })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to buy product');
    }
  },

  async getRealEstate(): Promise<RealEstate[]> {
    const res = await fetch(`${API_URL}?path=realestate`);
    if (!res.ok) throw new Error('Failed to get real estate');
    return res.json();
  },

  async createRealEstate(sellerId: number, title: string, price: number, address: string, rooms: number, area: number, description: string, imageUrl: string): Promise<RealEstate> {
    const res = await fetch(`${API_URL}?path=realestate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_id: sellerId, title, price, address, rooms, area, description, image_url: imageUrl })
    });
    if (!res.ok) throw new Error('Failed to create property');
    return res.json();
  },

  async buyRealEstate(buyerId: number, propertyId: number): Promise<void> {
    const res = await fetch(`${API_URL}?path=realestate/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyer_id: buyerId, property_id: propertyId })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to buy property');
    }
  },

  async getDeposits(userId: number): Promise<Deposit[]> {
    const res = await fetch(`${API_URL}?path=deposits&user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to get deposits');
    return res.json();
  },

  async createDeposit(userId: number, depositName: string, amount: number, rate: number, termMonths: number): Promise<Deposit> {
    const res = await fetch(`${API_URL}?path=deposits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, deposit_name: depositName, amount, rate, term_months: termMonths })
    });
    if (!res.ok) throw new Error('Failed to create deposit');
    return res.json();
  }
};
