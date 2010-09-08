
# Mastering Node

 Mastering node is an open source eBook by node hackers for node hackers. I started this as a side project and realized that I don't have time :) so go nuts, download it, build it, fork it, extend it and share it.

## Formats

 Mastering node is written using the markdown files provided in `./chapters`, which can then be converted to several output formats, currently including _pdf_, _mobi_, _epub_ and of course _html_.

## All Formats

    $ make

## PDF

Required by `make book.pdf`:

    $ brew install htmldoc
    $ make book.pdf

## HTML

Required by `make book.html`:

    $ gem install ronn
    $ make book.html

## EPUB

Required by `make book.epub`:
Requires [Calibre](http://calibre-ebook.com/)

    $ make book.epub

## MOBI

Required by `make book.mobi`:
Requires [Calibre](http://calibre-ebook.com/)

    $ make book.mobi

## References

Contents of this eBook currently reference the following software versions:

  - node 0.2.0

## Source

All example source can be run simply by executing node against the file,
for example:

      $ node src/events/basic.js

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://creativecommons.org/images/public/somerights20.png" /></a><br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/Text" property="dc:title" rel="dc:type">Mastering Node</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">TJ Holowaychuk</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.