import puppeteer from "puppeteer";

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://maesagroup.co.id/", {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const quotes = await page.evaluate(() => {
    const quote = document.querySelector("article > div > div > h3 > a");

    // Fetch the sub-elements from the previously fetched quote element
    const text = quote.textContent.replace(/[\n\t]/g, "");

    return { text };
  });

  // Display the quotes
  console.log(quotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();