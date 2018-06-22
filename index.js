var casper = require('casper').create();
var initpage = process.env.URL
require('dotenv').config()

casper.start(initpage);

casper.then(function() {
    this.echo('First Page: ' + this.getTitle(), "page" + this.getCurrentUrl());
});
// initial log in. 
casper.then(function() {
    this.waitForSelector("form input[name='j_username']", function() {

        this.fillSelectors('form', {
            'input[name = j_username ]': process.env.EPB_USER,
            'input[name = j_password ]': process.env.EP_PASS
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

                this.waitForSelector("form input[name='j_username']", function() {

                    this.fillSelectors('form', {
                        'input[name = j_username ]': process.env.EPB_USER,
                        'input[name = j_password ]': process.env.EP_PASS
                    }, true);
                });
                casper.then(function() {
                    console.log(this.echo(this.getCurrentUrl()));

                });
                casper.then(function() {
                    var button = this.evaluate(function() {
                        var btn = document.getElementById("j_id_a:clearAll");
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