import { mockProducts } from './mockData'

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product?: {
    id: number
    name: string
    price: number
    discount_price?: number
    images?: string[]
  }
}

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
  total: number
  total_items: number
}

const CART_STORAGE_KEY = 'cart_items'

// Simulate network delay
function delay(ms: number = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper to get cart from localStorage
function getCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to save cart to localStorage
function saveCartToStorage(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

// Helper to calculate total
function calculateTotal(items: CartItem[]): { total: number; total_items: number } {
  let total = 0
  let total_items = 0

  items.forEach(item => {
    const product = mockProducts.find(p => p.id === item.product_id)
    if (product) {
      const price = product.discount_price || product.price
      total += price * item.quantity
      total_items += item.quantity
    }
  })

  return { total, total_items }
}

// Helper to enrich cart items with product data
function enrichCartItems(items: CartItem[]): CartItem[] {
  return items.map(item => {
    const product = mockProducts.find(p => p.id === item.product_id)
    return {
      ...item,
      product: product ? {
        id: product.id,
        name: product.name,
        price: product.price,
        discount_price: product.discount_price,
        images: product.images
      } : undefined
    }
  })
}

export const cartService = {
  // Get cart
  async getCart(): Promise<Cart> {
    await delay(150)
    
    const userId = parseInt(localStorage.getItem('userId') || '0')
    const items = getCartFromStorage()
    const enrichedItems = enrichCartItems(items)
    const { total, total_items } = calculateTotal(enrichedItems)

    return {
      id: 1,
      user_id: userId,
      items: enrichedItems,
      total,
      total_items
    }
  },

  // Add item to cart
  async addItem(productId: number, quantity: number = 1) {
    await delay(200)
    
    const product = mockProducts.find(p => p.id === productId)
    if (!product) {
      throw {
        response: {
          status: 404,
          data: { error: 'Product not found' }
        }
      }
    }

    if (quantity > product.stock) {
      throw {
        response: {
          status: 422,
          data: { error: 'Insufficient stock' }
        }
      }
    }

    const items = getCartFromStorage()
    const existingItem = items.find(i => i.product_id === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.push({
        id: items.length + 1,
        product_id: productId,
        quantity
      })
    }

    saveCartToStorage(items)
    const enrichedItems = enrichCartItems(items)
    const { total, total_items } = calculateTotal(enrichedItems)

    return {
      success: true,
      cart: {
        items: enrichedItems,
        total,
        total_items
      }
    }
  },

  // Update cart item
  async updateItem(itemId: number, quantity: number) {
    await delay(200)
    
    const items = getCartFromStorage()
    const item = items.find(i => i.id === itemId)

    if (!item) {
      throw {
        response: {
          status: 404,
          data: { error: 'Cart item not found' }
        }
      }
    }

    const product = mockProducts.find(p => p.id === item.product_id)
    if (!product) {
      throw {
        response: {
          status: 404,
          data: { error: 'Product not found' }
        }
      }
    }

    if (quantity > product.stock) {
      throw {
        response: {
          status: 422,
          data: { error: 'Insufficient stock' }
        }
      }
    }

    if (quantity <= 0) {
      const index = items.findIndex(i => i.id === itemId)
      items.splice(index, 1)
    } else {
      item.quantity = quantity
    }

    saveCartToStorage(items)
    const enrichedItems = enrichCartItems(items)
    const { total, total_items } = calculateTotal(enrichedItems)

    return {
      success: true,
      cart: {
        items: enrichedItems,
        total,
        total_items
      }
    }
  },

  // Remove item from cart
  async removeItem(itemId: number) {
    await delay(200)
    
    const items = getCartFromStorage()
    const index = items.findIndex(i => i.id === itemId)

    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Cart item not found' }
        }
      }
    }

    items.splice(index, 1)
    saveCartToStorage(items)
    const enrichedItems = enrichCartItems(items)
    const { total, total_items } = calculateTotal(enrichedItems)

    return {
      success: true,
      cart: {
        items: enrichedItems,
        total,
        total_items
      }
    }
  },

  // Clear cart
  async clearCart() {
    await delay(200)
    
    localStorage.removeItem(CART_STORAGE_KEY)
    return { success: true }
  },

  // Get cart item count (for header)
  getCartItemCount(): number {
    const items = getCartFromStorage()
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }
}
