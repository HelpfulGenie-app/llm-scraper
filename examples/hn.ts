import { chromium } from 'playwright'
import { z } from 'zod'
import OpenAI from 'openai'
import LLMScraper from './../src'

// Create a new browser instance
const browser = await chromium.launch()

// Initialize the LLMScraper instance
const scraper = new LLMScraper(browser, new OpenAI())

// Define schema to extract contents into
const schema = z.object({
  top: z
    .array(
      z.object({
        title: z.string(),
        points: z.number(),
        by: z.string(),
        commentsURL: z.string(),
      })
    )
    .length(5)
    .describe('Top 5 stories on Hacker News'),
})

// URLs to scrape
const urls = ['https://news.ycombinator.com']

// Run the scraper
const pages = await scraper.run(urls, {
  model: 'gpt-4-turbo',
  schema,
  mode: 'html',
})

// Stream the result from LLM
for await (const page of pages) {
  console.log(page.data)
}
