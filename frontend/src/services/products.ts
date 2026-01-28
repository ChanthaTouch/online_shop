import { 
  mockProducts, 
  mockCategories, 
  searchProducts, 
  getProductBySlug 
} from './mockData'

export interface Product {
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

export interface Category {
  id: number
  name: string
  slug: string
}

// Simulate network delay
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const productService = {
  // Get all products (public)
  async getProducts(page = 1, category?: string, search?: string) {
    await delay(300)
    
    const result = searchProducts(search || '', category || '', page)
    
    return {
      data: result.data,
      current_page: result.current_page,
      last_page: result.last_page,
      total: result.total
    }
  },

  // Get single product by slug (public)
  async getProductBySlug(slug: string): Promise<Product> {
    await delay(200)
    
    const product = getProductBySlug(slug)
    if (!product) {
      throw {
        response: {
          status: 404,
          data: { error: 'Product not found' }
        }
      }
    }
    
    return product
  },

  // Create product (admin only)
  async createProduct(data: FormData) {
    await delay(300)
    
    const name = data.get('name') as string
    const slug = (name || '').toLowerCase().replace(/\s+/g, '-')
    const description = data.get('description') as string
    const price = parseFloat(data.get('price') as string)
    const stock = parseInt(data.get('stock') as string)
    const categoryId = parseInt(data.get('category_id') as string)

    const newProduct: Product = {
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      name,
      slug,
      description,
      price,
      stock,
      category_id: categoryId,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      is_active: true,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }

    mockProducts.push(newProduct)
    return { data: newProduct }
  },

  // Update product (admin only)
  async updateProduct(id: number, data: FormData) {
    await delay(300)
    
    const product = mockProducts.find(p => p.id === id)
    if (!product) {
      throw {
        response: {
          status: 404,
          data: { error: 'Product not found' }
        }
      }
    }

    const name = data.get('name') as string
    if (name) product.name = name
    if (data.get('description')) product.description = data.get('description') as string
    if (data.get('price')) product.price = parseFloat(data.get('price') as string)
    if (data.get('stock')) product.stock = parseInt(data.get('stock') as string)
    if (data.get('category_id')) product.category_id = parseInt(data.get('category_id') as string)
    product.updated_at = new Date().toISOString().split('T')[0]

    return { data: product }
  },

  // Delete product (admin only)
  async deleteProduct(id: number) {
    await delay(300)
    
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Product not found' }
        }
      }
    }

    mockProducts.splice(index, 1)
    return { success: true }
  },

  // Get all categories (public)
  async getCategories() {
    await delay(200)
    return mockCategories
  },

  // Get single category (public)
  async getCategoryById(id: number): Promise<Category> {
    await delay(200)
    
    const category = mockCategories.find(c => c.id === id)
    if (!category) {
      throw {
        response: {
          status: 404,
          data: { error: 'Category not found' }
        }
      }
    }
    
    return category
  },

  // Create category (admin only)
  async createCategory(data: { name: string; slug: string }) {
    await delay(300)
    
    const newCategory: Category = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      name: data.name,
      slug: data.slug
    }

    mockCategories.push(newCategory)
    return { data: newCategory }
  },

  // Update category (admin only)
  async updateCategory(id: number, data: { name: string; slug: string }) {
    await delay(300)
    
    const category = mockCategories.find(c => c.id === id)
    if (!category) {
      throw {
        response: {
          status: 404,
          data: { error: 'Category not found' }
        }
      }
    }

    category.name = data.name
    category.slug = data.slug

    return { data: category }
  },

  // Delete category (admin only)
  async deleteCategory(id: number) {
    await delay(300)
    
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Category not found' }
        }
      }
    }

    mockCategories.splice(index, 1)
    return { success: true }
  }
}
