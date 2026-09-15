// @ts-check

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.userTypeSelect = page.getByTestId('user-type-select');
    this.usernameInput = page.getByTestId('username-input');
    this.passwordRadio = page.getByTestId('auth-method-password');
    this.passcodeRadio = page.getByTestId('auth-method-passcode');
    this.credentialInput = page.getByTestId('credential-input');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto('./');
  }

  /** @param {'admin'|'customer'} type */
  async selectUserType(type) {
    await this.userTypeSelect.selectOption(type);
  }

/** @param {'password'|'passcode'} method */
  async useAuthMethod(method) {
    if (method === 'passcode') {
      await this.passcodeRadio.check();
    } else {
      await this.passwordRadio.check();
    }
  }

  /**
   * Fills the form and submits it.
   * @param {{ userType: 'admin'|'customer', username: string, credential: string, method?: 'password'|'passcode' }} params
   */
  async login({ userType, username, credential, method = 'password' }) {
    await this.selectUserType(userType);
    await this.usernameInput.fill(username);
    await this.useAuthMethod(method);
    await this.credentialInput.fill(credential);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };