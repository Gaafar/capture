import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { port } from './config';
import webshot from 'webshot';

const app = global.app = express();

// Register Node.js middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*

get screenshot of a web page

params (query):
    url :: String, page url
    width :: int, page width to simulate
    height :: int or 'all', screenshot height, default: 'all' captures whole page
    fixed :: Bool, adds css to page to disable animations
    ua :: USER_AGENTS, user agent to simulate
*/
app.get('/api/capture', (req, res) => {

    let { url, width = 320, height = 568, ua = null, fixed = false } = req.query;

    console.log(`/api/capture url:${url}`)
    if (!url) return res.sendStatus(404);

    const USER_AGENTS = {
        "mobile": 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    };

    const CUSTOM_CSS =
        `body 
            {animation: none !important; -webkit-animation: none !important;}`


    let options = {
        screenSize: {
            width: width,
            height: height
        },
        shotSize: {
            width: width,
            height: 'all'
        },
        userAgent: USER_AGENTS[ua],
        customCSS: fixed ? CUSTOM_CSS : null,

        // uncomment this if needed to delay screen shot
        renderDelay: 2000
        phantomConfig: { 'ignore-ssl-errors': 'true' }
    };

    let renderStream = webshot(decodeURIComponent(url), options);

    renderStream.pipe(res);
})


// Launch the app
app.listen(port, () => {
    console.log(`The app is running at http://localhost:${port}/`);
});
