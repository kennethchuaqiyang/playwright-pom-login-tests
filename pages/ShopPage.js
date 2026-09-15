// @ts-check

class ShopPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.shopPage = page.getByTestId('shop-page');
    this.productGrid = page.getByTestId('product-grid');
    this.cartNote = page.getByTestId('cart-note');
    this.loggedInAs = page.getByTestId('logged-in-as');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto() {
    await this.page.goto('./shop.html');
  }

  /** @param {string} productId e.g. 'p1' */
  addToCart(productId) {
    return this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { ShopPage };