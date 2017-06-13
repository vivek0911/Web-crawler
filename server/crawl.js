const linkService = require('./db/services/link.service');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};  // store visited links
var numPagesVisited = 0;
var pagesToVisit = [];  // store pages to be visited
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);

const crawl = () => {
     if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        var promissArr3 = [];
        // crawl function will return from here so before that insert all visited links to database
        Object.keys(pagesVisited || {}).forEach(function(url) {
            promissArr3.push(linkService.makeVisited(url));
        });
        Promise.all(promissArr).then(() => {
            console.log('final database update happen');
            return;
        });
    }
    var nextPage = pagesToVisit.pop();
    var promissArr = [];
    /*  every time we find pagesToVisit array empty, we fetch all non-visisted pages from database and store all of them
    into pagesToVisit array temporarily. So we don't need to query database each time we need new page to start on.

    Before retrieving non visited links, we insert all visisted links stored in temporary object pagesVisited. We update if
    link already present in database. So we don't need to make query to update database for visisted links.
    */
    if(!nextPage) {
        Object.keys(pagesVisited || {}).forEach(function(url) {
            promissArr.push(linkService.makeVisited(url));
        });
       Promise.all(promissArr).then((results) => {
           const visitedURL = results;
           pagesVisited = [];
           linkService.getAllLinks().then((links) => {
               pagesToVisit = [...pagesToVisit, ...links];
               crawl();
           });
       });

    } else {
        if (nextPage in pagesVisited) {
            // We've already visited this page, so repeat the crawl
            crawl();
        } else {
            // New page we haven't visited
            visitPage(nextPage, crawl);
        }
    }
};

const visitPage = (url, callback) => {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
     var isWordFound = searchForWord($, SEARCH_WORD);
     if(isWordFound) {
       console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
       var promissArr4 = [];
        Object.keys(pagesVisited || {}).forEach(function(url) {
            promissArr4.push(linkService.makeVisited(url));
        });
        Promise.all(promissArr4).then(() => {
            console.log('final database update happen');
            return;
        });
     } else {
       collectInternalLinks($, callback);
     }
  });
}

const searchForWord = ($, word) => {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

const collectInternalLinks = ($, callback) => {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    var promissArr2 = [];
    relativeLinks.each(function() {
        promissArr2.push(linkService.addLink(baseUrl + $(this).attr('href')));
        // pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
    Promise.all(promissArr2).then(() => {
        console.log('collected links have been inserted to db');
        callback();
    });
}

module.exports = crawl;