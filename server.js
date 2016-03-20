import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { port } from './config'
import webshot from 'webshot'

const app = global.app = express()

// Register Node.js middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/*
get screenshot of a web page

params (query):
    url :: String, page url
    width :: int, page width to simulate
    height :: int, page height to simulate, does not affect screenshot height as it will capture whole page anyway
    anim :: Bool, enable css animations
    ua :: USER_AGENTS, user agent to simulate
    delay :: int, time in ms to wait before taking screenshot
*/
app.get('/api/capture', (req, res) => {

    const { url, width = 320, height = 568, ua = null, anim = false, delay = 1000} = req.query

    console.log(`/api/capture url:${url}`)

    // exit if no url sent
    if (!url) return res.sendStatus(404)

    const USER_AGENTS = {
        "mobile": 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    }
    const BLOCK_ANIM_CSS = `* {animation: none !important; -webkit-animation: none !important;}`

    const options = {
        screenSize: {
            width: width,
            height: height
        },
        shotSize: {
            width: width,
            height: 'all'
        },
        userAgent: USER_AGENTS[ua],
        customCSS: anim ? '' : BLOCK_ANIM_CSS,

        // uncomment this if needed to delay screen shot
        renderDelay: delay,

        phantomConfig: { 'ignore-ssl-errors': 'true' },
    }

    const renderStream = webshot(decodeURIComponent(url), options)
    renderStream.pipe(res)
})


// Launch the app
app.listen(port, () => {
    console.log(`The app is running at http://localhost:${port}/`)
})
