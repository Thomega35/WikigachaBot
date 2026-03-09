import { chromium } from "patchright";
import fs from "fs";
import path from 'path';

async function codyCheeseCode(page) {
    await page.evaluate(() => {
        const dbName = "wiki-gacha-db";
        const storeName = "user_data";
        const targetKey = "en:pack_balance";
        const newValue = 999999;

        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([storeName], "readwrite");
            transaction.objectStore(storeName).put(newValue, targetKey);
            transaction.oncomplete = () => db.close();
        };

        request.onerror = () => { };
    });
}

async function getAndDisplayPackBalance(page) {

    await page.waitForTimeout(2000);

    const container = page.locator('span.text-sm.text-gray-400', { hasText: 'Unique Cards' });
    const numbers = container.locator('span.text-white.font-bold');

    let uniqueCards = parseInt(await numbers.nth(0).innerText(), 10);
    let totalPulls = parseInt(await numbers.nth(1).innerText(), 10);

    while (true) {

        // break when values are valid
        if (totalPulls == 0 || uniqueCards != 0) {
            break;
        }

        uniqueCards = parseInt(await numbers.nth(0).innerText(), 10);
        totalPulls = parseInt(await numbers.nth(1).innerText(), 10);

        // wait for page update
        await page.waitForTimeout(500);
    }

    console.log(`Unique Cards: ${uniqueCards}, Total Pulls: ${totalPulls}`);
    return { uniqueCards, totalPulls };
}

async function goToHome(page) {
    //do until success

    while (true) {
        try {
            await page.goto("https://wikigacha.com/");
            await page.waitForURL("https://wikigacha.com/");
            console.log('Navigated to home successfully');
            break; // Exit loop if click is successful
        } catch (e) {
            console.log('Failed to go to home, retrying...');
            //retry
        }
    }
}

(async () => {
    console.log('Starting wikigacha bot...');
    const browser = await chromium.launchPersistentContext('./patchright_profile', {
        channel: 'chrome',
        headless: false,
        viewport: null,
    });

    console.log('Browser launched successfully');
    const page = await browser.newPage();
    console.log('New page created');

    page.on('dialog', async dialog => {
        try {
            console.log('Dialog shown:', dialog.message());
            await dialog.accept('verysecu'); // your text for the prompt
        } catch (err) {
            console.log('Dialog handling failed:', err.message);
        }
    });
    page.on('alert', async alert => {
        await alert.accept();
    });
    page.on('download', async download => {
        //delete old saves
        try {
            await fs.promises.rm('./wikigachasave.json', { force: true });
            console.log('Old saves deleted successfully');
        } catch (err) {
            console.error('Error deleting old saves:', err);
        }
        download.saveAs('./wikigachasave.json');
    });
    page.once('filechooser', async (fileChooser) => {
        await fileChooser.setFiles(path.resolve('./wikigachasave.json'));
    });

    await goToHome(page);

    // Load save if exists
    if (fs.existsSync('./wikigachasave.json')) {
        while (true) {
            try {
                await page.getByRole('button', { name: 'Collection' }).click();
                console.log('Collection button clicked successfully');
                break; // Exit loop if click is successful
            } catch (e) {
                console.log('Failed to click Collection button, retrying...');
                await goToHome(page);
            }
        }

        const { uniqueCards, totalPulls } = await getAndDisplayPackBalance(page);

        if (uniqueCards < 10 && totalPulls < 50) {
            await page.getByRole('button', { name: 'Import' }).click();
            // Find the hidden <input type="file">
            const fileInput = page.locator('input[aria-label="Select backup file"]');
            // Wait until the input is attached to the DOM
            await fileInput.waitFor({ state: 'attached' });
            // Set your file directly (absolute path is safest)
            await fileInput.setInputFiles(path.resolve('./wikigachasave.json'));
            const dialog = await page.waitForEvent('dialog');
            console.log('Dialog shown:', dialog.message());
            console.log('Save loaded successfully');
            try {
                await dialog.accept('verysecu');
            } catch (err) {
                console.log('Dialog already handled:', err.message);
            }
            await page.waitForTimeout(20000); // wait for the import to process
            await goToHome(page);
            await page.getByRole('button', { name: 'Collection' }).click();
            await getAndDisplayPackBalance(page);
        } else {
            console.log('Data is not empty, skipping import');
        }
    }

    await goToHome(page);

    // Main loop
    let begin = new Date();
    while (true) {
        const shouldICheat = await page.getByRole('heading', { name: 'No Packs Left' }).isVisible();
        // console.log(`Should I cheat?: ${shouldICheat}`);
        if (shouldICheat) {
            await codyCheeseCode(page);
            await goToHome(page);
        }
        try {
            await page.locator('#gacha-pack-container').click();
            await page.getByRole('button', { name: 'BACK TO PACKS' }).click();
        } catch (e) {
            // console.log('No back button, probably still loading');
        }
        // Every minute do backup
        const currentTime = new Date().getTime();
        if (currentTime - begin >= 120000) {
            begin = currentTime;
            try {
                await page.getByRole('button', { name: 'Collection' }).click();
                await getAndDisplayPackBalance(page);
                await page.getByRole('button', { name: 'Export' }).click();
            } catch (e) {
                console.log('Tant pis, la prochaine fois peut-être');
            }
            await goToHome(page);
        }
    }

})();