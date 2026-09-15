// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AdminPage } = require('../pages/AdminPage');
const { ShopPage } = require('../pages/ShopPage');

const ADMIN_USERS = [
  { username: 'admin1', password: 'Admin@123', passcode: '111111' },
  { username: 'admin2', password: 'Admin@456', passcode: '222222' },
];

const CUSTOMER_USERS = [
  { username: 'customer1', password: 'Cust@123', passcode: '333333' },
  { username: 'customer2', password: 'Cust@456', passcode: '444444' },
];

/****
 * Runs the full 10-test suite (correct + 4 wrong combos, for both password
 * and passcode) for a given user type.
 * @param {'admin'|'customer'} userType
 * @param {{username: string, password: string, passcode: string}[]} users
 * @param {(page: import('@playwright/test').Page) => AdminPage|ShopPage} makeDestinationPage
 * @param {RegExp} destinationUrlPattern
 */
function runSuiteFor(userType, users, makeDestinationPage, destinationUrlPattern) {
  const label = userType === 'admin' ? 'Admin' : 'Customer';
  const [validUser] = users;
  const invalidUsername = userType === 'admin' ? 'not-an-admin' : 'not-a-customer';

  test.describe(`${label} - password`, () => {
    // Test 1 / 11: correct password, data-driven across both valid users
    for (const user of users) {
      test(`${label} logs in with correct password - ${user.username}`, async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login({ userType, username: user.username, credential: user.password, method: 'password' });

        await expect(page).toHaveURL(destinationUrlPattern);
        const dest = makeDestinationPage(page);
        await expect(dest.loggedInAs).toContainText(user.username);
      });
    }

    // Test 2 / 12: no username, correct password
    test(`${label} - no username, correct password`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: '', credential: validUser.password, method: 'password' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Enter a username');
    });

    // Test 3 / 13: invalid username, correct password
    test(`${label} - invalid username, correct password`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: invalidUsername, credential: validUser.password, method: 'password' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText(`No ${userType} account`);
    });

    // Test 4 / 14: valid username, no password
    test(`${label} - valid username, no password`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: validUser.username, credential: '', method: 'password' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Enter a username');
    });

    // Test 5 / 15: valid username, wrong password
    test(`${label} - valid username, wrong password`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: validUser.username, credential: 'WrongPass123', method: 'password' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Incorrect password');
    });
  });

  test.describe(`${label} - passcode`, () => {
    // Test 6 / 16: correct passcode, data-driven across both valid users
    for (const user of users) {
      test(`${label} logs in with correct passcode - ${user.username}`, async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login({ userType, username: user.username, credential: user.passcode, method: 'passcode' });

        await expect(page).toHaveURL(destinationUrlPattern);
        const dest = makeDestinationPage(page);
        await expect(dest.loggedInAs).toContainText(user.username);
      });
    }

    // Test 7 / 17: no username, correct passcode
    test(`${label} - no username, correct passcode`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: '', credential: validUser.passcode, method: 'passcode' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Enter a username');
    });

    // Test 8 / 18: invalid username, correct passcode
    test(`${label} - invalid username, correct passcode`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: invalidUsername, credential: validUser.passcode, method: 'passcode' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText(`No ${userType} account`);
    });

    // Test 9 / 19: valid username, no passcode
    test(`${label} - valid username, no passcode`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: validUser.username, credential: '', method: 'passcode' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Enter a username');
    });

    // Test 10 / 20: valid username, wrong passcode
    test(`${label} - valid username, wrong passcode`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login({ userType, username: validUser.username, credential: '999999', method: 'passcode' });

      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Incorrect passcode');
    });
  });
}

runSuiteFor('admin', ADMIN_USERS, (page) => new AdminPage(page), /admin\.html/);
runSuiteFor('customer', CUSTOMER_USERS, (page) => new ShopPage(page), /shop\.html/);