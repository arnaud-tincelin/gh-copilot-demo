import { test, expect, Page } from '@playwright/test'
import path from 'path'

const MOCK_ALBUMS = [
  {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    price: 12.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Abbey+Road',
  },
  {
    id: 2,
    title: 'Thriller',
    artist: 'Michael Jackson',
    price: 9.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Thriller',
  },
  {
    id: 3,
    title: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    price: 11.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Dark+Side',
  },
]

async function setupMockAlbums(page: Page) {
  await page.route('/albums', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ALBUMS),
    })
  )
}

test.describe('Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAlbums(page)
    await page.goto('/')
    // Wait for albums to load
    await page.waitForSelector('.album-card')
  })

  test('cart icon is visible in the header', async ({ page }) => {
    const cartBtn = page.locator('.cart-btn')
    await expect(cartBtn).toBeVisible()
    await page.screenshot({ path: '/tmp/screenshots/01-header-cart-icon.png' })
  })

  test('cart badge is hidden when cart is empty', async ({ page }) => {
    const badge = page.locator('.cart-badge')
    await expect(badge).not.toBeVisible()
  })

  test('album cards display "Add to Cart" button', async ({ page }) => {
    const firstCard = page.locator('.album-card').first()
    await expect(firstCard.locator('.btn-primary')).toContainText('Add to Cart')
    await page.screenshot({ path: '/tmp/screenshots/02-album-card.png' })
  })

  test('clicking "Add to Cart" shows badge with count 1', async ({ page }) => {
    await page.locator('.album-card').first().locator('.btn-primary').click()
    const badge = page.locator('.cart-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
    await page.screenshot({ path: '/tmp/screenshots/03-cart-badge-after-add.png' })
  })

  test('badge count increments for each unique album added', async ({ page }) => {
    const cards = page.locator('.album-card')
    await cards.nth(0).locator('.btn-primary').click()
    await cards.nth(1).locator('.btn-primary').click()
    await expect(page.locator('.cart-badge')).toHaveText('2')
    await page.screenshot({ path: '/tmp/screenshots/04-badge-count-two.png' })
  })

  test('adding same album multiple times increments count correctly', async ({ page }) => {
    const firstCard = page.locator('.album-card').first().locator('.btn-primary')
    await firstCard.click()
    await firstCard.click()
    await firstCard.click()
    await expect(page.locator('.cart-badge')).toHaveText('3')
  })

  test('clicking cart icon opens the cart panel', async ({ page }) => {
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-panel')).toBeVisible()
    await page.screenshot({ path: '/tmp/screenshots/05-cart-panel-open.png' })
  })

  test('cart panel shows empty state when no albums added', async ({ page }) => {
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-empty')).toBeVisible()
    await expect(page.locator('.cart-empty')).toContainText('Your cart is empty')
    await page.screenshot({ path: '/tmp/screenshots/06-cart-empty-state.png' })
  })

  test('cart panel lists added albums', async ({ page }) => {
    await page.locator('.album-card').first().locator('.btn-primary').click()
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-item')).toHaveCount(1)
    await expect(page.locator('.cart-item-title').first()).toContainText('Abbey Road')
    await page.screenshot({ path: '/tmp/screenshots/07-cart-panel-with-item.png' })
  })

  test('cart panel shows all added albums', async ({ page }) => {
    const cards = page.locator('.album-card')
    await cards.nth(0).locator('.btn-primary').click()
    await cards.nth(1).locator('.btn-primary').click()
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-item')).toHaveCount(2)
    await page.screenshot({ path: '/tmp/screenshots/08-cart-panel-two-items.png' })
  })

  test('remove button removes album from cart', async ({ page }) => {
    await page.locator('.album-card').first().locator('.btn-primary').click()
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-item')).toHaveCount(1)
    await page.locator('.remove-btn').first().click()
    await expect(page.locator('.cart-empty')).toBeVisible()
    await expect(page.locator('.cart-badge')).not.toBeVisible()
    await page.screenshot({ path: '/tmp/screenshots/09-cart-after-remove.png' })
  })

  test('closing the cart panel hides it', async ({ page }) => {
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-panel')).toBeVisible()
    await page.locator('.close-btn').click()
    await expect(page.locator('.cart-panel')).not.toBeVisible()
    await page.screenshot({ path: '/tmp/screenshots/10-cart-closed.png' })
  })

  test('clicking overlay closes the cart panel', async ({ page }) => {
    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-panel')).toBeVisible()
    // Click on the overlay (outside the panel)
    await page.locator('.cart-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('.cart-panel')).not.toBeVisible()
  })

  test('cart count and items stay in sync', async ({ page }) => {
    const cards = page.locator('.album-card')
    await cards.nth(0).locator('.btn-primary').click()
    await cards.nth(1).locator('.btn-primary').click()
    await expect(page.locator('.cart-badge')).toHaveText('2')

    await page.locator('.cart-btn').click()
    await expect(page.locator('.cart-item')).toHaveCount(2)

    await page.locator('.remove-btn').first().click()
    await expect(page.locator('.cart-item')).toHaveCount(1)
    await expect(page.locator('.cart-badge')).toHaveText('1')
    await page.screenshot({ path: '/tmp/screenshots/11-cart-sync.png' })
  })

  test('clear cart removes all items', async ({ page }) => {
    const cards = page.locator('.album-card')
    await cards.nth(0).locator('.btn-primary').click()
    await cards.nth(1).locator('.btn-primary').click()
    await page.locator('.cart-btn').click()
    await page.locator('.clear-btn').click()
    await expect(page.locator('.cart-empty')).toBeVisible()
    await expect(page.locator('.cart-badge')).not.toBeVisible()
    await page.screenshot({ path: '/tmp/screenshots/12-cart-cleared.png' })
  })
})
