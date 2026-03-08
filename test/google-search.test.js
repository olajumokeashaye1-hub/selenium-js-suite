
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('Google Search Example', function () {
    let driver;

    // Helper to save screenshot
    async function saveScreenshot(prefix) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${prefix}-${timestamp}.png`;
        const dir = path.join(__dirname, 'screenshots');

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
            .addArguments('--headless=chrome')  // or just '--headless'
            //.setChromeOptions(new chrome.Options().addArguments('--headless=new'))
            .build();
    });

    it('should search for Selenium and verify title', async function () {
        await driver.get('https://www.google.com');
        await driver.findElement(By.name('q')).sendKeys('Selenium WebDriver', Key.RETURN);
        await driver.wait(until.titleContains('Selenium'), 10000);
        const title = await driver.getTitle();
        console.log('Actual page title:', title);
        expect(title.toLowerCase()).to.include('selenium webdriver');

    });

    after(async function () {
        await driver.quit();
    });
});