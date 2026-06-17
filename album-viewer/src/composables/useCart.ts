import { reactive, computed } from 'vue'
import type { Album } from '../types/album'

export interface CartItem extends Album {
  quantity: number
}

const items = reactive<CartItem[]>([])

const count = computed(() => items.reduce((sum, item) => sum + item.quantity, 0))

function addToCart(album: Album): void {
  const existing = items.find((item) => item.id === album.id)
  if (existing) {
    existing.quantity++
  } else {
    items.push({ ...album, quantity: 1 })
  }
}

function removeFromCart(albumId: number): void {
  const index = items.findIndex((item) => item.id === albumId)
  if (index !== -1) {
    items.splice(index, 1)
  }
}

function clearCart(): void {
  items.splice(0, items.length)
}

export function useCart() {
  return { items, count, addToCart, removeFromCart, clearCart }
}
