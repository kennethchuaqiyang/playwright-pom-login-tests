// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',

  // Points at your live GitHub Pages site. Change this if you rename the repo
  // or want to test a local copy (e.g. http://localhost:8080).
  use: {
    baseURL: 'https://kennethchuaqiyang.github.io/demo-login-portal/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});