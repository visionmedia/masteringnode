
MD = pages/index.md \
	 chapters/introduction.md

HTML = $(MD:.md=.html)

book.pdf: $(HTML)
	htmldoc $(HTML) --outfile $@

%.html: %.md
	ronn -5 --pipe --fragment $< \
		| sed -E 's/<h1>([^ ]+) - /<h1>/' \
		> $@

view: book.pdf
	open book.pdf

clean:
	rm -f book.pdf
	rm -f pages/*.html
	rm -f chapters/*.html

.PHONY: view clean