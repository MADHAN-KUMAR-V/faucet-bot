const axios = require("axios");
const puppeteer = require("puppeteer");

async function startFaucet() {
  while (true) {
    let browser;
    try {
      const response = await axios.post(
        "https://offerwall.me/offerwall/zy5d1jq8pgy59h5c27mhfsiols76hq/648aff3f72c3976118d3f925",
        "token=d48ca99c1b3ff18c07268a742d504de506f20ff731a25292d8685f293e3d7b11&action=start_faucet",
        {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            origin: "https://offerwall.me",
            referer:
              "https://offerwall.me/offerwall/zy5d1jq8pgy59h5c27mhfsiols76hq/648aff3f72c3976118d3f925",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            Cookie: "PHPSESSID=a8p5ctlr6l64bvibbsiakvcegj",
          },
        }
      );

      // Extract URL from response
      const message = response.data.message;
      const urlMatch = message.match(/window\.open\('([^']+)'\)/);

      if (urlMatch && urlMatch[1]) {
        const sessionUrl = urlMatch[1];
        console.log("Opening URL:", sessionUrl);

        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000); // Increase timeout to 60 seconds
        await page.goto(sessionUrl, { waitUntil: "load" });

        // Wait for 2 minutes
        console.log("Waiting for 1 minutes...");
        await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000));

        // Close browser before restarting
        await browser.close();
        console.log("Session completed. Restarting...");
      } else {
        console.error("Session URL not found.");
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      if (browser) await browser.close();
    }
  }
}

// Start the loop
startFaucet();
