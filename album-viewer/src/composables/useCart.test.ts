import { beforeEach, describe, expect, it } from 'vitest'
import { useCart } from './useCart'
import type { Album } from '../types/album'

const makeAlbum = (id: number): Album => ({
  id,
  title: `Album ${id}`,
  artist: `Artist ${id}`,
  price: 9.99,
  image_url: `https://example.com/${id}.png`
})

describe('useCart', () => {
  beforeEach(() => {
    // Ensure a clean shared state between tests.
    useCart().clearCart()
  })

  it('starts empty', () => {
    const { items, count } = useCart()
    expect(items).toHaveLength(0)
    expect(count.value).toBe(0)
  })

  it('adds an album and increases the count', () => {
    const { addToCart, items, count } = useCart()
    addToCart(makeAlbum(1))
    expect(items).toHaveLength(1)
    expect(count.value).toBe(1)
  })

  it('increments quantity instead of duplicating when adding the same album', () => {
    const { addToCart, items, count } = useCart()
    addToCart(makeAlbum(1))
    addToCart(makeAlbum(1))
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
    expect(count.value).toBe(2)
  })

  it('counts the total quantity across different albums', () => {
    const { addToCart, count } = useCart()
    addToCart(makeAlbum(1))
    addToCart(makeAlbum(2))
    addToCart(makeAlbum(2))
    expect(count.value).toBe(3)
  })

  it('removes an album and decreases the count', () => {
    const { addToCart, removeFromCart, items, count } = useCart()
    addToCart(makeAlbum(1))
    addToCart(makeAlbum(2))
    removeFromCart(1)
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe(2)
    expect(count.value).toBe(1)
  })

  it('does nothing when removing a non-existent album', () => {
    const { addToCart, removeFromCart, count } = useCart()
    addToCart(makeAlbum(1))
    removeFromCart(999)
    expect(count.value).toBe(1)
  })

  it('clears the cart', () => {
    const { addToCart, clearCart, items, count } = useCart()
    addToCart(makeAlbum(1))
    addToCart(makeAlbum(2))
    clearCart()
    expect(items).toHaveLength(0)
    expect(count.value).toBe(0)
  })
})
