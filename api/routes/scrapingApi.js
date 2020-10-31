var express = require("express");
var router = express.Router();
const cheerio = require('cheerio');
const request = require('request-promise');
var app = require("node-server-screenshot");


// run the async function
router.get("/getScaringData", async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const url = req.query.url;
    let imdbData = [];
    let hyperlinks = [];
    let socialMediaLinks = [];
    var sourceString = url.replace('http://', '').replace('https://', '').replace('www.', '').replace('.com', '').split(/[/?#]/)[0];
    (async () => {
        app.fromURL(url, `screenshots/${sourceString}.png`, function () {
            //an image of google.com has been saved at ./test.png
        });
        const response = await request(url);
        let $ = cheerio.load(response);
        let title = $('head title').text();
        let desc = $('meta[name="description"]').attr('content');
        let kwd = $('meta[name="keywords"]').attr('content');
        $('a').each(function () {
            var link = $(this).attr('href');
            if (link && link.match(/services/)) {
                hyperlinks.push(link);
            };
            if (link && link.match(/facebook/)) {
                socialMediaLinks.push(link)
            }
            if (link && link.match(/twitter/)) {
                socialMediaLinks.push(link)
            }
            if (link && link.match(/linkedin/)) {
                socialMediaLinks.push(link)
            }
            if (link && link.match(/youtube/)) {
                socialMediaLinks.push(link)
            }
        });
        let uniqueLinks = [...new Set(hyperlinks)];
        let uniqueSocialLinks = [...new Set(socialMediaLinks)];
        imdbData.push({
            title: title,
            desc: desc,
            keyword: kwd,
            hyperLinks: uniqueLinks,
            socialMediaLinks: uniqueSocialLinks,
        })
        res.json(imdbData);
    })()
});

module.exports = router;
