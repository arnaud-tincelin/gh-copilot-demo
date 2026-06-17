import { describe, it, expect, beforeEach } from 'vitest'
import { useCart } from './useCart'

describe('useCart', () => {
  const { items, count, addToCart, removeFromCart, clearCart } = useCart()

  const albumA = { id: 1, title: 'Album A', artist: 'Artist A', price: 9.99, image_url: '' }
  const albumB = { id: 2, title: 'Album B', artist: 'Artist B', price: 14.99, image_url: '' }

  beforeEach(() => {
    clearCart()
  })

  it('starts with an empty cart', () => {
    expect(items.length).toBe(0)
    expect(count.value).toBe(0)
  })

  it('adding an album increases count', () => {
    addToCart(albumA)
    expect(count.value).toBe(1)
  })

  it('adding the same album increments quantity, not row count', () => {
    addToCart(albumA)
    addToCart(albumA)
    expect(items.length).toBe(1)
    expect(items[0].quantity).toBe(2)
    expect(count.value).toBe(2)
  })

  it('adding different albums creates separate rows', () => {
    addToCart(albumA)
    addToCart(albumB)
    expect(items.length).toBe(2)
    expect(count.value).toBe(2)
  })

  it('removing an album decreases count', () => {
    addToCart(albumA)
    addToCart(albumB)
    removeFromCart(albumA.id)
    expect(count.value).toBe(1)
    expect(items.find((i) => i.id === albumA.id)).toBeUndefined()
  })

  it('removing a non-existent album does nothing', () => {
    addToCart(albumA)
    removeFromCart(999)
    expect(count.value).toBe(1)
  })

  it('count reflects total quantity across all albums', () => {
    addToCart(albumA)
    addToCart(albumA)
    addToCart(albumB)
    expect(count.value).toBe(3)
  })

  it('clearCart empties all items', () => {
    addToCart(albumA)
    addToCart(albumB)
    clearCart()
    expect(items.length).toBe(0)
    expect(count.value).toBe(0)
  })
})
