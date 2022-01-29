import config from 'config';
import { Browser, ElementHandle, Page } from 'puppeteer';

import videoSearchResponse from '../interfaces/videoSearchResponse.interface';

// Configurations
const typeOptions = { delay: 100 };
const waitTime = 1500;

/**
 *
 * @param {Browser} browser
 * @param {Page} page
 * Recives browser and page puppeteer objects as arguments.
 *
 * Steps:
 * 1. First goes to the google oAuth2 page whcih will redirect to youtube studio dashboard after the login.
 * 2. Inputs the users email and password.
 * 3. Waits 30 seconds to check if the target url is the youtube studio dashboard. At this time, the user should authenticate himself, if MFA is enabled (specifcally the push notifications type).
 */
export const loginToYouTubeAccount = async (browser: Browser, page: Page): Promise<void> => {
    const OAUTH2_GOOGLE_URL: string = config.get('OAUTH2_GOOGLE_URL');
    const EMAIL: string = config.get('EMAIL');
    const PASSWORD: string = config.get('PASSWORD');
    const YOUTUBE_STUDIO_DASHBOARD_URL: string = config.get('YOUTUBE_STUDIO_DASHBOARD_URL');

    if (!OAUTH2_GOOGLE_URL || !EMAIL || !PASSWORD || !YOUTUBE_STUDIO_DASHBOARD_URL) throw new Error();

    await page.goto(config.get('OAUTH2_GOOGLE_URL'));

    await page.type('[type="email"]', EMAIL, typeOptions);
    await page.waitForTimeout(waitTime);

    await page.click('#identifierNext');
    await page.waitForTimeout(waitTime);

    await page.type('[type="password"', PASSWORD, typeOptions);
    await page.click('#passwordNext');

    await browser.waitForTarget((target) => target.url() === YOUTUBE_STUDIO_DASHBOARD_URL);
};

/**
 *
 * @param {Browser} browser
 * @param {Page} page
 * @param {string} videoTitle
 * Recives browser and page puppeteer objects and a string as arguments.
 *
 * Steps:
 * 1. First clicks the content tab in the sidebar which will redirect to the channel's video content.
 * 2. Selects the filter input and searches for the video title.
 *
 * @returns
 * Returns an oject with a type of "FOUND" or "NOT_FOUND", whcih means if the videos were found or not. In addition, the object it includes an appropiate message.
 */
export const videoSearch = async (browser: Browser, page: Page, videoTitle: string): Promise<videoSearchResponse> => {
    await page.click('#menu-item-1');

    await page.type('#text-input', videoTitle, typeOptions);
    const filterInputEl: ElementHandle<HTMLInputElement> | null = await page.$('#text-input');
    if (!filterInputEl) throw new Error();
    await filterInputEl.click();
    await filterInputEl.type(videoTitle, typeOptions);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const noContentEl: ElementHandle<HTMLInputElement> | null = await page.$(
        '.no-content style-scope ytcp-video-section-content'
    );

    if (noContentEl) {
        await browser.close();

        return { type: 'NOT_FOUND', message: `No videos were found with the search: ${videoTitle}` };
    }

    return { type: 'Found' };
};

export const shareVideosToEmail = async (browser: Browser, page: Page): Promise<void> => {
    const videoElArr = await page.$$('[role="table"] div#row-container div#video-thumbnail a#thumbnail-anchor');
    if (!videoElArr) throw new Error();

    const link: string = (await (await videoElArr[0].getProperty('href')).jsonValue()) || '';
    if (!link) throw new Error();

    const videoPage: Page = await browser.newPage();
    await videoPage.goto(link);
    await page.waitForTimeout(5000);

    const visibilityDropdownHandle = await page.evaluateHandle<ElementHandle<HTMLDivElement>>(() => {
        const div = document.querySelector('ytcp-video-metadata-visibility > div#container');
        console.log(div);
        return div;
    });
    console.log(visibilityDropdownHandle);
    await visibilityDropdownHandle.click();

    await videoPage.close();

    // Looping through all the videos that were found.
    // for (const videoEl of videoElArr) {
    //     const link: string = (await (await videoEl.getProperty('href')).jsonValue()) || '';
    //     if (!link) throw new Error();

    //     const videoPage: Page = await browser.newPage();
    //     await videoPage.goto(link);
    //     await page.waitForTimeout(5000);

    //     const visibilityDropdownHandle = await page.evaluateHandle<ElementHandle<HTMLDivElement>>(() => {
    //         const div = document.querySelector('ytcp-video-metadata-visibility > div#container');
    //         console.log(div);
    //         return div;
    //     });
    //     console.log(visibilityDropdownHandle);
    //     // visibilityDropdownHandle.click();

    //     await videoPage.close();
    // }
};
