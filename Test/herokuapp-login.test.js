const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('Herokuapp Login Page Test', function () {
    this.timeout(30000); // 30 seconds timeout for the whole suite

    let driver;

    // Helper: save screenshot
    async function saveScreenshot(prefix) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${prefix}-${timestamp}.png`;
        const dir = path.join(__dirname, '../screenshots');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(path.join(dir, filename), screenshot, 'base64');
        console.log(`Screenshot saved: screenshots/${filename}`);
    }

    before(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(
                new chrome.Options()
                    .addArguments('--headless=chrome')  // or just '--headless'
                    //.addArguments('--headless=new')
                    .addArguments('--disable-gpu')
                    .addArguments('--window-size=1920,1080')
            )
            .build();
    });

    it('should login successfully with valid credentials', async function () {
        try {
            // 1. Go to login page
            await driver.get('https://the-internet.herokuapp.com/login');
            console.log('Navigated to login page');

            // 2. Enter username
            await driver.findElement(By.id('username')).sendKeys('tomsmith');
            console.log('Entered username');

            // 3. Enter password
            await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
            console.log('Entered password');

            // 4. Click Login button
            await driver.findElement(By.css('button[type="submit"]')).click();
            console.log('Clicked Login button');

            // 5. Wait for success message
            await driver.wait(until.elementLocated(By.id('flash')), 10000);

            // 6. Get and check the flash message
            const flashElement = await driver.findElement(By.id('flash'));
            const messageText = await flashElement.getText();
            const trimmedMessage = messageText.trim();

            console.log('Flash message:', trimmedMessage);

            // Assertions
            expect(trimmedMessage).to.include('You logged into a secure area!');
            expect(await flashElement.isDisplayed()).to.be.true;

            // Success screenshot
            await saveScreenshot('login-success');

            console.log('✅ Login test passed!');

        } catch (error) {
            // Failure screenshot
            await saveScreenshot('login-failure');
            console.error('Login test failed:', error.message);
            throw error; // fail the test
        }
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});