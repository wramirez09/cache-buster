var casper = require('casper').create();
var initpage = process.env.URL
require('dotenv').config()

var config = {
    selectors : {
        username : "input[name = any_usernameIdentifier ]",
        userpassword: 'input[name = any_passwordIdentifier ]',
        "clearAllButton": "j_id_a:clearAll"
    }
}

casper.start(initpage);

casper.then(function() {
    this.echo('First Page: ' + this.getTitle(), "page" + this.getCurrentUrl());
});
// initial log in. 
casper.then(function() {
    this.waitForSelector(config.selectors.username, function() {

        this.fillSelectors('form', {
            config.selectors.username: process.env.EPB_USER,
            config.selectors.userpassword: process.env.EP_PASS
        }, true);

    });
});
casper.then(function() {
    // grab all links of page 
    var listOfLinks = this.evaluate(function() {
        var links = [].map.call(document.querySelectorAll("a"), function(link) {
            return link.href;
        });
        return links;
    });

    // remove first link
    listOfLinks.shift();

    // iterate over links and open each page 
    this.each(listOfLinks, function(self, link) {


        self.thenOpen(link, function(a) {

            this.wait(500, function() {

                this.waitForSelector(config.selectors.username, function() {

                    this.fillSelectors('form', {
                        config.selectors.username: process.env.EPB_USER,
                        config.selectors.userpassword: process.env.EP_PASS
                    }, true);
                });
                casper.then(function() {
                    console.log(this.echo(this.getCurrentUrl()));

                });
                casper.then(function() {
                    var button = this.evaluate(function() {
                        var btn = document.getElementById(config.selectors.clearAllButton);
                        btn.click();
                    });
                });
            });
        });
    });
});
// log the current page on
casper.then(function() {
    console.log('last page ', this.getCurrentUrl());

});

casper.then(function() {
    console.log('caches are clear !');

});

casper.run();