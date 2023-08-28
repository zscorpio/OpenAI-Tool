const puppeteer = require('puppeteer');
module.exports = {
    async getBalance(account, password) {
        let browser;
        try {
            let options = {
                headless: 'new',
                defaultViewport: { width: 1440, height: 1000 },
                ignoreHTTPSErrors: false,
                ignoreDefaultArgs: ['--enable-automation'],
                args: [
                    '--no-sandbox',
                    '--lang=zh-CN',
                    '--disable-blink-features=AutomationControlled',
                    `--window-size=${1440},${1000}`,
                ],
            };
            // options.headless = false;
            // options.devtools = true;
            browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            await page.evaluateOnNewDocument(() => {
                const newProto = navigator.__proto__;
                delete newProto.webdriver;
                navigator.__proto__ = newProto;
            });
            await page.setRequestInterception(true)
            let authorization;
            page.on('request', (request) => {
                if (request.url().endsWith("dashboard/billing/credit_grants"))
                    authorization = request.headers()["authorization"]
                request.continue()
            })
            await page.goto('https://platform.openai.com/login?launch');
            await page.waitForSelector('#username');
            await page.type('#username', account, { delay: parseInt(Math.random() * 50 + '') });
            const submitBtn = await page.$('button');
            await submitBtn.click();
            await page.waitForSelector('#password');
            await page.type('#password', password, { delay: parseInt(Math.random() * 50 + '') });
            const loginBtn = (await page.$$('button'))[2];
            await loginBtn.click();

            await page.waitForSelector('.launcher-menu');
            await page.goto('https://platform.openai.com/account/usage');
            const subscriptionResponse = await page.waitForResponse(
                (response) =>
                    response.url().indexOf('dashboard/billing/subscription') > -1 &&
                    response.request().method() !== 'OPTIONS',
                {
                    timeout: 30000,
                }
            );
            const subscriptionData = JSON.parse(await subscriptionResponse.text());
            const usageResponse = await page.waitForResponse(
                (response) =>
                    response.url().indexOf('dashboard/billing/usage') > -1 && response.request().method() !== 'OPTIONS',
                {
                    timeout: 30000,
                }
            );
            const usageData = JSON.parse(await usageResponse.text());
            let total = 5;
            if (subscriptionData.has_payment_method) {
                total = 120;
            }
            let usage = 0;
            if (usageData.total_usage) {
                usage = usageData.total_usage / 100;
            }
            let left = total - usage;
            return {
                total,
                usage,
                left,
                authorization
            };
        } catch (e) {
            console.log(e);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
        return {
            total: 0,
            usage: 0,
            left:0
        };
    },
};
