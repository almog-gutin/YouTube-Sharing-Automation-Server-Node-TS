import { Request, Response } from 'express';
import { Browser, Page } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as puppetterUtils from '../utils/puppeteer.utils';

export const shareYouTubeVideos = async (req: Request, res: Response): Promise<void> => {
    // const { email, videoTitle }: { email: string; videoTitle: string } = req.body;

    puppeteerExtra.use(stealthPlugin());
    const browser: Browser = await puppeteerExtra.launch({ headless: false });

    try {
        const page: Page = await browser.newPage();

        await puppetterUtils.loginToYoutubeAccount(browser, page);

        await page.waitForTimeout(5000);

        res.send({ status: 200, message: 'Ok' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    } finally {
        await browser.close();
    }
};

export const unshareYouTubeVideos = async (req: Request, res: Response): Promise<void> => {};
