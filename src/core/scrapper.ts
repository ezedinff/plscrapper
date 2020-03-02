import puppeteer from 'puppeteer'
import {credentials, LOGIN_URL, loginPageSelector, PATH, pathPageSelector, courseBox} from "../config/utils";
import {url} from "inspector";
import { Path } from '../models/path';
import { Course } from '../models/course';

export class Scrapper {
    // TODO
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    path: Path = {};
    start() {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (async () => {
            const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox']});
            const page = await browser.newPage();
           // await page.setRequestInterception(true);
         //   await page.setDefaultNavigationTimeout(0);
            // await this.interceptRequest(page);
            await page.setDefaultNavigationTimeout(0);

            // Navigate to some website e.g Our Code World
           await this.authenticate(page);
            await this.pathPage(page);
            console.log(JSON.stringify(this.path));
           // await browser.close();
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
        
        const path = await page.evaluate((PATH_TITLE, PATH_DESCRIPTION, PATH, courseBox, baserURL) => {
            const p: Path = {};
            p['title'] = (document.querySelectorAll(PATH_TITLE)[0] as HTMLElement).innerText;
            p['description'] = (document.querySelectorAll(PATH_DESCRIPTION)[0] as HTMLElement).innerText;
            p['path'] = PATH;
            const courses: Course[] = [];
                const courseBoxs = document.querySelectorAll(courseBox.BOX);
                const courseLinks = document.querySelectorAll(courseBox.LINK);
                const courseTitles = document.querySelectorAll(courseBox.TITLE);
                const courseAuthors = document.querySelectorAll(courseBox.AUTHOR);
                const courseDates = document.querySelectorAll(courseBox.DATE);
                const courseHours = document.querySelectorAll(courseBox.HOUR);
                const courseLevels = document.querySelectorAll(courseBox.LEVEL);
                for(let i = 0; i < courseBoxs.length; i++) {
                    courses.push({
                        title: (courseTitles[i] as HTMLElement).getElementsByTagName('span')[0].getElementsByTagName('span')[0].innerText,
                        path: `${baserURL}${(courseLinks[i] as HTMLElement).getAttribute('href')}`,
                        author: (courseAuthors[i] as HTMLElement).innerText,
                        level: (courseLevels[i] as HTMLElement).innerText,
                        hour: (courseHours[i] as HTMLElement).innerText,
                        date: (courseDates[i] as HTMLElement).innerText,
                    });
                }
                p['course'] = courses;
            return p;
            //.getElementsByTagName('span')[0].getElementsByTagName('span')[0].innerText;
        }, pathPageSelector.PATH_TITLE, pathPageSelector.PATH_DESCRIPTION, PATH, courseBox, LOGIN_URL);
        this.path = path;
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
