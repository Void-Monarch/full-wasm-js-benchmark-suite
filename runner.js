import { chromium, firefox, webkit } from "playwright";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserChoice = process.argv[2] || "chromium";

async function launchBrowser(choice) {
  if (choice === "firefox") return await firefox.launch();
  if (choice === "webkit") return await webkit.launch();
  return await chromium.launch();
}

(async () => {
  const browser = await launchBrowser(browserChoice);
  const page = await browser.newPage();

  await page.goto("http://localhost:8080/benchmark.html");

  // wait until benchmark.js registers the function
  await page.waitForFunction(() => window.runAllBenchmarks !== undefined);

  const results = await page.evaluate(async () => {
    return await window.runAllBenchmarks();
  });

  await browser.close();

  const csvWriter = createObjectCsvWriter({
    path: `results_${browserChoice}.csv`,
    header: [
      { id: "browser", title: "Browser" },
      { id: "name", title: "Benchmark" },
      { id: "mean", title: "Mean (ms)" },
      { id: "median", title: "Median (ms)" },
      { id: "std", title: "Std Dev (ms)" },
      { id: "min", title: "Min (ms)" },
      { id: "max", title: "Max (ms)" },
    ],
  });

  const enriched = results.map((r) => ({
    browser: browserChoice,
    ...r,
  }));

  await csvWriter.writeRecords(enriched);

  console.log(`Results saved to results_${browserChoice}.csv`);
})();
