import puppeteer from 'puppeteer'
import {credentials, LOGIN_URL, loginPageSelector, PATH} from "../config/utils";
import {url} from "inspector";

export class Scrapper {
    // TODO
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    start() {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (async () => {
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
           // await page.setRequestInterception(true);
         //   await page.setDefaultNavigationTimeout(0);
            // await this.interceptRequest(page);
            await page.setDefaultNavigationTimeout(0);

            // Navigate to some website e.g Our Code World
           await this.authenticate(page);
            await this.pathPage(page);
            await browser.close();
        })()
    }
    async authenticate(page: puppeteer.Page): Promise<void>{
        await page.goto(LOGIN_URL,{waitUntil: "load", timeout: 0} );

        // signInForm
        await page.waitForSelector('#passwordSignInForm');
        // enter values
        await page.type(loginPageSelector.USERNAME_FIELD, credentials.USER_NAME);
        await page.type(loginPageSelector.PASSWORD_FIELD, credentials.PASSWORD);
        await page.click(loginPageSelector.SUBMIT_BUTTON);

    }

    async pathPage(page: puppeteer.Page): Promise<void>{
        await page.goto(PATH, {waitUntil: "load", timeout: 0} );
    }

    courseOverViewPage(): void {
//
    }

    videoPage(): void {
        //
    }

    async waitPageToLoad(page: puppeteer.Page): Promise<void> {
        await page.waitFor(5000);
    }
    async interceptRequest(page: puppeteer.Page): Promise<void> {
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'document') {
                request.continue();
            } else {
                request.abort();
            }
        });
    }
}
