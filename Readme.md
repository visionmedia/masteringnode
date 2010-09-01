
# Mastering Node

 Mastering node is an open source eBook by node hackers for node hackers. I started this as a side project and realized that I don't have time :) so go nuts, download it, build it, fork it, extend it and share it.

## Formats

 Mastering node is written using the markdown files provided in `./chapters`, which can then be converted to several output formats, currently including _pdf_, and of course _html_.

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
Requires (Calibre)[http://calibre-ebook.com/]

    $ make book.epub

## MOBI

Required by `make book.mobi`:
Requires (Calibre)[http://calibre-ebook.com/]

    $ make book.mobi

## References

Contents of this eBook currently reference the following software versions:

  - node 0.2.0

## Source

All example source can be run simply by executing node against the file,
for example:

      $ node src/events/basic.js