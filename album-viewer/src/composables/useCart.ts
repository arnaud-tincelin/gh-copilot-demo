import { computed, reactive } from 'vue'
import type { Album } from '../types/album'

export interface CartItem extends Album {
  quantity: number
}

// Module-level reactive state so the cart is shared across all components.
const items = reactive<CartItem[]>([])

const STORAGE_KEY = 'album-viewer-cart'

const persist = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors (e.g. private mode or unavailable storage).
  }
}

const load = (): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw) as CartItem[]
    if (Array.isArray(parsed)) {
      items.splice(0, items.length, ...parsed)
    }
  } catch {
    // Ignore malformed storage payloads.
  }
}

let loaded = false

export function useCart() {
  if (!loaded && typeof localStorage !== 'undefined') {
    load()
    loaded = true
  }

  const count = computed(() => items.reduce((total, item) => total + item.quantity, 0))

  const addToCart = (album: Album): void => {
    const existing = items.find((item) => item.id === album.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.push({ ...album, quantity: 1 })
    }
    persist()
  }

  const removeFromCart = (albumId: number): void => {
    const index = items.findIndex((item) => item.id === albumId)
    if (index !== -1) {
      items.splice(index, 1)
      persist()
    }
  }

  const clearCart = (): void => {
    items.splice(0, items.length)
    persist()
  }

  return {
    items,
    count,
    addToCart,
    removeFromCart,
    clearCart
  }
}
