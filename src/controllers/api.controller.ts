import { Request, Response } from 'express';
import { Browser, Page } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as puppetterUtils from '../utils/puppeteer.utils';

export const shareYouTubeVideos = async (req: Request, res: Response): Promise<void | Response> => {
    const { email, videoTitle }: { email: string; videoTitle: string } = req.body;
    if (!email || !videoTitle)
        return res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: 'User must enter an email address and video title.',
        });

    puppeteerExtra.use(stealthPlugin());
    const browser: Browser = await puppeteerExtra.launch({ headless: false });

    try {
        const page: Page = await browser.newPage();

        await puppetterUtils.loginToYouTubeAccount(browser, page);
        await page.waitForTimeout(2500);

        const videoSearchResult = await puppetterUtils.videoSearch(browser, page, videoTitle);
        if (videoSearchResult.type === 'NOT_FOUND')
            return res.send({
                status: 200,
                statusText: 'Ok',
                message: 'No videos were found.',
            });
        await page.waitForTimeout(2500);

        await puppetterUtils.shareVideosToEmail(browser, page);

        await page.waitForTimeout(5000);

        res.send({ status: 200, statusText: 'Ok', message: 'Successfully shared the videos.' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 500, statusText: 'Internal Server Error', message: '' });
    } finally {
        await browser.close();
    }
};

export const unshareYouTubeVideos = async (req: Request, res: Response): Promise<void> => {};
