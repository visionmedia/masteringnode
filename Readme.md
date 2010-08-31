
# Mastering Node

 Mastering node is an open source eBook by node hackers for node hackers. I started this as a side project and realized that I don't have time :) so go nuts, download it, build it, extend it, fork it, and share it.

## Formats

Required by `make book.pdf`:

  $ brew install htmldoc

Required by `make book.html`:

  $ gem install ronn

Output formats:

  $ make
  $ make book.pdf
  $ make book.html

## References

Contents of this eBook currently reference the following software versions:

  - node 0.2.0

## Source

All example source can be run simply by executing node against the file,
for example:

    $ node src/events/basic.js