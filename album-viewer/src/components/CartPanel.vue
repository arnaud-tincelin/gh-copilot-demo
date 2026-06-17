<template>
  <Transition name="panel">
    <div v-if="isOpen" class="cart-overlay" @click.self="$emit('close')">
      <div class="cart-panel" role="dialog" aria-label="Shopping cart">
        <div class="cart-header">
          <h2>🛒 Your Cart <span class="cart-count-text">({{ count }})</span></h2>
          <button class="close-btn" aria-label="Close cart" @click="$emit('close')">✕</button>
        </div>

        <div v-if="items.length === 0" class="cart-empty">
          <p>Your cart is empty.</p>
          <p class="cart-empty-hint">Add some albums to get started!</p>
        </div>

        <ul v-else class="cart-items">
          <li v-for="item in items" :key="item.id" class="cart-item">
            <img
              :src="item.image_url"
              :alt="item.title"
              class="cart-item-image"
              @error="handleImageError"
            />
            <div class="cart-item-info">
              <p class="cart-item-title">{{ item.title }}</p>
              <p class="cart-item-artist">{{ item.artist }}</p>
              <p class="cart-item-price">${{ (item.price * item.quantity).toFixed(2) }}
                <span v-if="item.quantity > 1" class="cart-item-qty">× {{ item.quantity }}</span>
              </p>
            </div>
            <button
              class="remove-btn"
              aria-label="Remove from cart"
              @click="removeFromCart(item.id)"
            >
              Remove
            </button>
          </li>
        </ul>

        <div v-if="items.length > 0" class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <span class="total-price">${{ total.toFixed(2) }}</span>
          </div>
          <button class="clear-btn" @click="clearCart">Clear Cart</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '../composables/useCart'

defineProps<{ isOpen: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { items, count, removeFromCart, clearCart } = useCart()

const total = computed(() =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/60x60/667eea/white?text=🎵'
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-panel {
  width: 380px;
  max-width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  background: #667eea;
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.cart-count-text {
  opacity: 0.85;
  font-size: 1rem;
  font-weight: normal;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: white;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  text-align: center;
}

.cart-empty p {
  margin: 0.25rem 0;
  font-size: 1.1rem;
}

.cart-empty-hint {
  color: #999;
  font-size: 0.9rem !important;
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
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-artist {
  color: #666;
  font-size: 0.875rem;
  margin: 0 0 0.2rem;
}

.cart-item-price {
  color: #667eea;
  font-weight: bold;
  margin: 0;
}

.cart-item-qty {
  font-size: 0.8rem;
  color: #999;
  font-weight: normal;
}

.remove-btn {
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #e74c3c;
  color: white;
}

.cart-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.total-price {
  color: #667eea;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #667eea;
  color: white;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-active .cart-panel,
.panel-leave-active .cart-panel {
  transition: transform 0.3s ease;
}

.panel-enter-from .cart-panel,
.panel-leave-to .cart-panel {
  transform: translateX(100%);
}
</style>
