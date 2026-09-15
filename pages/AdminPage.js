// @ts-check

class AdminPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.adminPage = page.getByTestId('admin-page');
    this.adminImage = page.getByTestId('admin-image');
    this.loggedInAs = page.getByTestId('logged-in-as');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto() {
    await this.page.goto('./admin.html');
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { AdminPage };