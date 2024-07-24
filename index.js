import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  const quotesArray = [];

  let hasNextPage = true;
  while (hasNextPage) {
    // Get page data
    const quotes = await page.evaluate(() => {
      const quoteElements = document.querySelectorAll(".quote");
      const quotesOnPage = [];

      quoteElements.forEach((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
        quotesOnPage.push({ text, author });
      });

      return quotesOnPage;
    });

    quotesArray.push(...quotes);

    // Check if there is a next page
    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector(".pager > .next > a");
      if (nextButton) {
        nextButton.click();
        return true;
      }
      return false;
    });

    // Wait for the next page to load
    if (hasNextPage) {
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }
  }

  // Display the quotes
  console.log(quotesArray);

  await browser.close();
};

// Start the scraping
getQuotes();
