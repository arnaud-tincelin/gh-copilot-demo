import { test, expect } from '@playwright/test'

test.describe('Cart management', () => {
  test('adds the first album to the cart and shows it in the cart panel', async ({ page }) => {
    // Step 1: Open the Album App.
    await page.goto('/')
    await expect(page.getByRole('heading', { name: '🎵 Album Collection' })).toBeVisible()

    const firstCard = page.locator('.album-card').first()
    await expect(firstCard).toBeVisible()
    const firstAlbumTitle = (await firstCard.getByRole('heading').innerText()).trim()

    // Step 2: Click "Add to Cart" on the first tile.
    await firstCard.getByRole('button', { name: 'Add to Cart' }).click()

    // The cart badge in the header should now show 1 item.
    const openCartButton = page.getByRole('button', { name: 'Open cart' })
    await expect(openCartButton).toContainText('1')

    // Step 3: Click the cart button on the top right to display the cart.
    await openCartButton.click()
    const cart = page.getByRole('dialog', { name: 'Shopping cart' })
    await expect(cart).toBeVisible()

    // Step 4: Check that the cart contains the added album.
    const cartItem = cart.getByRole('listitem').filter({ hasText: firstAlbumTitle })
    await expect(cartItem).toBeVisible()
    await expect(cartItem).toContainText('x1')

    // Step 5: Take a screenshot of the cart.
    await cart.screenshot({ path: 'tests/screenshots/cart.png' })
  })
})
