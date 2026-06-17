<template>
  <transition name="cart-fade">
    <div v-if="open" class="cart-overlay" @click.self="$emit('close')">
      <aside class="cart-panel" role="dialog" aria-label="Shopping cart">
        <header class="cart-header">
          <h2>Your Cart</h2>
          <button class="cart-close" aria-label="Close cart" @click="$emit('close')">✕</button>
        </header>

        <div v-if="items.length === 0" class="cart-empty">
          <p>Your cart is empty.</p>
        </div>

        <ul v-else class="cart-items">
          <li v-for="item in items" :key="item.id" class="cart-item">
            <img :src="item.image_url" :alt="item.title" class="cart-item-image" />
            <div class="cart-item-info">
              <p class="cart-item-title">{{ item.title }}</p>
              <p class="cart-item-artist">{{ item.artist }}</p>
              <p class="cart-item-meta">
                <span class="cart-item-price">${{ item.price.toFixed(2) }}</span>
                <span class="cart-item-qty">x{{ item.quantity }}</span>
              </p>
            </div>
            <button
              class="cart-item-remove"
              aria-label="Remove from cart"
              @click="removeFromCart(item.id)"
            >
              Remove
            </button>
          </li>
        </ul>

        <footer v-if="items.length > 0" class="cart-footer">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value">${{ total.toFixed(2) }}</span>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '../composables/useCart'

defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { items, removeFromCart } = useCart()

const total = computed(() =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.cart-panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.cart-close {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #666;
}

.cart-empty {
  padding: 2rem 1.5rem;
  color: #666;
  text-align: center;
}

.cart-items {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f2f2f2;
  align-items: center;
}

.cart-item-image {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.cart-item-artist {
  margin: 0.15rem 0;
  color: #666;
  font-size: 0.85rem;
}

.cart-item-meta {
  margin: 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.cart-item-price {
  color: #667eea;
  font-weight: 700;
}

.cart-item-qty {
  color: #999;
  font-size: 0.85rem;
}

.cart-item-remove {
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: #c0392b;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.cart-item-remove:hover {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  font-size: 1.1rem;
}

.cart-total-label {
  color: #333;
  font-weight: 600;
}

.cart-total-value {
  color: #667eea;
  font-weight: 700;
}

.cart-fade-enter-active,
.cart-fade-leave-active {
  transition: opacity 0.2s ease;
}

.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
}
</style>
