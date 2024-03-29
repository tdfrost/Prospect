if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const puppeteer = require('puppeteer-extra')
const proxyChain = require('proxy-chain')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgent = require('user-agents')
const { createUserAgentsArray, assignNewUserAgent } = require('./helper')
const { chromeHeader } = require('./header')

puppeteer.use(StealthPlugin())

const INDEED_HOMEPAGE = ''
const ECHO_SERVER = 'http://localhost:8083'
const TEST_HOME =
  'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending'
const BOT_TEST = 'https://bot.sannysoft.com/'
const LINKEDIN_REFERRAL = 'https://www.google.com/'
let randomUserAgentsArray = createUserAgentsArray(20)

async function run() {
  //const oldProxyUrl = `http://${process.env.PROXY_USER}:${process.env.PROXY_PASS}_country-UnitedStates@24.199.75.16:31112`

  //const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl)
  //console.log(newProxyUrl)

  const browser = await puppeteer.launch({
    headless: true,
    // args: [`--proxy-server=${newProxyUrl}`],
  })
  try {
    const page = await browser.newPage()

    const randomUserAgent = assignNewUserAgent(randomUserAgentsArray)
    await page.setUserAgent(randomUserAgent)
    await page.setExtraHTTPHeaders(chromeHeader(randomUserAgent))
    //console.log((await page.goto(TEST_HOME)).request().headers())

    await page.goto(ECHO_SERVER)
    await new Promise((resolve) => setTimeout(resolve, 10000))
    await page.screenshot({ path: 'header.png', fullPage: true })
    await page.goto(TEST_HOME)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await page.screenshot({ path: 'example.png', fullPage: true })
  } catch (error) {
    console.error('Jobs scrape failed', error)
  } finally {
    await browser.close()
    // proxyChain.closeAnonymizedProxy(newProxyUrl, true)
  }
}

run()
