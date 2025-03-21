const axios = require("axios");
const puppeteer = require("puppeteer");

async function startFaucet() {
  try {
    const response = await axios.post(
      "https://offerwall.me/offerwall/zy5d1jq8pgy59h5c27mhfsiols76hq/648aff3f72c3976118d3f925",
      "token=d48ca99c1b3ff18c07268a742d504de506f20ff731a25292d8685f293e3d7b11&action=start_faucet"
    );

    // Log the full response
    console.log("API Response:", response.data);

    if (!response.data || !response.data.message) {
      console.error("Error: 'message' field missing in response");
      return;
    }

    const message = response.data.message;
    const urlMatch = message.match(/window\.open\('([^']+)'\)/);

    if (urlMatch && urlMatch[1]) {
      const sessionUrl = urlMatch[1];
      console.log("Opening URL:", sessionUrl);

      // Launch Puppeteer and open the URL
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(sessionUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      }); // Increased timeout to 60s

      // Wait for 2 minutes
      console.log("Waiting for 2 minutes...");
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));

      // Close browser before next interval
      await browser.close();
      console.log("Session completed. Restarting...");
    } else {
      console.error("Session URL not found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run every 2 minutes, ensuring previous instance is closed before opening a new one
(async function runBot() {
  while (true) {
    await startFaucet();
    console.log("Waiting 2 minutes before next run...");
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
  }
})();
