import puppeteer from "puppeteer";

const scrapeTikTokTags = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate to the TikTok Discover page
  await page.goto("https://www.tiktok.com/discover", {
    waitUntil: "networkidle2",
  });

  // Wait for the content to load and scroll to load more tags
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight || totalHeight > 5000){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  // Extract the tags and post counts
  const tagsInfo = await page.evaluate(() => {
    const tagElements = document.querySelectorAll('div[data-e2e="explore-feed-item"]');
    
    return Array.from(tagElements).slice(0, 20).map(element => {
      const titleElement = element.querySelector('h4[data-e2e="explore-feed-title"]');
      const postCountElement = element.querySelector('div[data-e2e=""][title="posts"]');

      if (titleElement && postCountElement) {
        return [
          titleElement.textContent.trim(),
          postCountElement.textContent.trim().split(' ')[0]
        ];
      }
      return null;
    }).filter(item => item !== null);
  });

  // Format the output
  const formattedOutput = {
    tags: tagsInfo.map(([namaTag, jumlahDigunakan]) => ({ namaTag, jumlahDigunakan }))
  };

  console.log(JSON.stringify(formattedOutput, null, 2));
  console.log(`Total tags found: ${tagsInfo.length}`);

  await browser.close();
};

// Jalankan scraper
scrapeTikTokTags();