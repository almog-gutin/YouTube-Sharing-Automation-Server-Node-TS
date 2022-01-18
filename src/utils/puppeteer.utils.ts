import config from 'config';
import { Browser, Page } from 'puppeteer';

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
export const loginToYoutubeAccount = async (browser: Browser, page: Page): Promise<void> => {
    const OAUTH2_GOOGLE_URL: string = config.get('OAUTH2_GOOGLE_URL');
    const EMAIL: string = config.get('EMAIL');
    const PASSWORD: string = config.get('PASSWORD');
    const YOUTUBE_STUDIO_DASHBOARD_URL: string = config.get('YOUTUBE_STUDIO_DASHBOARD_URL');

    if (!OAUTH2_GOOGLE_URL || !EMAIL || !PASSWORD || YOUTUBE_STUDIO_DASHBOARD_URL) throw new Error();

    await page.goto(config.get('OAUTH2_GOOGLE_URL'));

    await page.type('[type="email"]', EMAIL);
    await page.waitForTimeout(1500);

    await page.click('#identifierNext');
    await page.waitForTimeout(1500);

    await page.type('[type="password"', PASSWORD);
    await page.click('#passwordNext');

    await browser.waitForTarget((target) => target.url() === YOUTUBE_STUDIO_DASHBOARD_URL);
};
