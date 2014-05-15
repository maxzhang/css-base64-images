var Path = require('path'),
    fs = require('fs'),
    b64 = require('..');

require('should');

describe('A complex CSS', function() {
    var cssFile = Path.join(__dirname, 'fixture', 'css', 'style.css'),
        htmlFile = Path.join(__dirname, 'fixture', 'html', 'test.html'),
        relative = Path.join(__dirname, 'fixture', 'css'),
        root = Path.join(__dirname, 'fixture');

    it('a file should be optimized with base64', function(done) {
        b64.fromFile(cssFile, root, function(err, css) {
            cssShouldBeCorrect(css);
            done();
        });
    });

    it('a string should be optimized with base64', function(done) {
        var css = fs.readFileSync(cssFile);
        b64.fromString(css, relative, root, function(err, css) {
            cssShouldBeCorrect(css);
            done();
        });
    });

    it('a html file should be optimized with base64', function(done) {
        b64.fromFile(htmlFile, root, function(err, html) {
            htmlShouldBeCorrect(html);
            done();
        });
    });
});

function cssShouldBeCorrect(css) {
    css.should.include(".single-quote {\n  background: url('data:image/gif;base64,");
    css.should.include(".double-quote {\n  background: url(\"data:image/gif;base64,");
    css.should.include(".absolute {\n  background: url('data:image/gif;base64,");

    css.should.include(".external {\n  background: url('http");
    css.should.include(".tooBig {\n  background: url('../img");
    css.should.include(".not-found {\n  background: url('../img");

    css.should.include(".mediatype {\n  background: url('data:image/svg+xml;base64,");
}

function htmlShouldBeCorrect(html) {
    html.should.include('<img alt="gif" src="data:image/gif;base64,');
    html.should.include('<img alt="not-found" src="../img');
    html.should.include('<img alt="svg" src="data:image/svg+xml;base64,');

    html.should.include('<script type="text/javascript" src="main.js"></script>');
}
