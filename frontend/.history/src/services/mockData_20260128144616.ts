// Mock Data Service - All frontend data without backend API

export interface MockProduct {
  id: number
  name: string
  slug: string
  description: string
  price: number
  discount_price?: number
  stock: number
  category_id: number
  images?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MockCategory {
  id: number
  name: string
  slug: string
  image?: string
}

export interface MockUser {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
}

// Mock Categories
export const mockCategories: MockCategory[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Home',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Books',
    slug: 'books',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80'
  }
]

// Mock Products
export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 129.99,
    discount_price: 99.99,
    stock: 10,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-15',
    updated_at: '2025-01-20'
  },
  {
    id: 2,
    name: 'Leather Watch',
    slug: 'leather-watch',
    description: 'Classic leather watch with stainless steel case',
    price: 89.99,
    stock: 15,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-10',
    updated_at: '2025-01-18'
  },
  {
    id: 3,
    name: 'Designer Sunglasses',
    slug: 'designer-sunglasses',
    description: 'UV protection designer sunglasses',
    price: 159.99,
    discount_price: 129.99,
    stock: 8,
    category_id: 2,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-12',
    updated_at: '2025-01-19'
  },
  {
    id: 4,
    name: 'Fitness Tracker',
    slug: 'fitness-tracker',
    description: 'Advanced fitness tracker with heart rate monitor',
    price: 49.99,
    stock: 20,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-08',
    updated_at: '2025-01-17'
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable waterproof bluetooth speaker',
    price: 79.99,
    discount_price: 59.99,
    stock: 12,
    category_id: 1,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-05',
    updated_at: '2025-01-16'
  },
  {
    id: 6,
    name: 'Winter Jacket',
    slug: 'winter-jacket',
    description: 'Warm winter jacket with thermal lining',
    price: 199.99,
    discount_price: 149.99,
    stock: 5,
    category_id: 2,
    images: ['https://images.unsplash.com/photo-1539533057440-7fc97eac3054?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-03',
    updated_at: '2025-01-15'
  },
  {
    id: 7,
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: '100% organic cotton t-shirt',
    price: 29.99,
    stock: 50,
    category_id: 2,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-14'
  },
  {
    id: 8,
    name: 'Facial Serum',
    slug: 'facial-serum',
    description: 'Hydrating facial serum with vitamin C',
    price: 34.99,
    discount_price: 24.99,
    stock: 25,
    category_id: 3,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2024-12-28',
    updated_at: '2025-01-13'
  },
  {
    id: 9,
    name: 'Desk Lamp',
    slug: 'desk-lamp',
    description: 'LED desk lamp with USB charging',
    price: 44.99,
    stock: 18,
    category_id: 4,
    images: ['https://images.unsplash.com/photo-1565636192335-14c46fa1120d?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2024-12-25',
    updated_at: '2025-01-12'
  },
  {
    id: 10,
    name: 'The Great Gatsby',
    slug: 'the-great-gatsby',
    description: 'Classic novel by F. Scott Fitzgerald',
    price: 12.99,
    stock: 30,
    category_id: 5,
    images: ['https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2024-12-20',
    updated_at: '2025-01-11'
  },
  {
    id: 11,
    name: 'Ceramic Vase',
    slug: 'ceramic-vase',
    description: 'Handcrafted ceramic vase for home decor',
    price: 39.99,
    discount_price: 29.99,
    stock: 22,
    category_id: 4,
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    created_at: '2024-12-15',
    updated_at: '2025-01-10'
  }
  {
    id: 12,
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip yoga mat with carrying strap',
    price: 25.99,
    stock: 40,
    category_id: 1,
    
  }
]

// Mock Users (hardcoded for testing)
export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@test.com',
    role: 'customer'
  }
]

// Mock Discounts
export const mockDiscounts = [
  {
    id: 1,
    code: 'SAVE10',
    description: 'Save 10% on all products',
    discount_percentage: 10,
    valid: true
  },
  {
    id: 2,
    code: 'SAVE20',
    description: 'Save 20% on electronics',
    discount_percentage: 20,
    valid: true,
    category: 'electronics'
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: 'Free shipping on orders over $50',
    discount_type: 'shipping',
    valid: true
  }
]

// Helper function to search products
export function searchProducts(
  query: string = '',
  category: string = '',
  page: number = 1
): { data: MockProduct[]; current_page: number; last_page: number; total: number } {
  let filtered = [...mockProducts]

  // Filter by search query
  if (query.trim()) {
    const q = query.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }

  // Filter by category
  if (category) {
    const cat = mockCategories.find(c => c.slug === category)
    if (cat) {
      filtered = filtered.filter(p => p.category_id === cat.id)
    }
  }

  // Pagination
  const itemsPerPage = 12
  const total = filtered.length
  const lastPage = Math.ceil(total / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage

  return {
    data: filtered.slice(start, end),
    current_page: page,
    last_page: lastPage,
    total
  }
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): MockProduct | undefined {
  return mockProducts.find(p => p.slug === slug)
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): MockCategory | undefined {
  return mockCategories.find(c => c.slug === slug)
}

// Helper function to validate discount code
export function validateDiscountCode(code: string): any {
  return mockDiscounts.find(d => d.code === code.toUpperCase() && d.valid)
}
