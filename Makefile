
MD = parts/index.md \
	  parts/toc.md

HTML = $(MD:.md=.html)

book.pdf: $(HTML)
	htmldoc $< --outfile $@

%.html: %.md
	ronn -5 --pipe --fragment $< | sed 's/<h1>index - /<h1>/g' > $@

view: book.pdf
	open book.pdf

clean:
	rm -f book.pdf
	rm -f parts/*.html

.PHONY: view clean