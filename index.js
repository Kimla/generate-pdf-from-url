const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
const uuidv4 = require('uuid/v4')
const path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/generate-pdf', function (req, res) {
  const url = req.query.url
  const filePath = 'files/' + uuidv4() + '.pdf';

  (async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle'})
    await page.pdf({path: filePath, format: 'A4'})

    await browser.close()
    await res.download(path.join(__dirname + '/' + filePath));
  })();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
