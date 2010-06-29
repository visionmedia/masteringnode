
PDF_FLAGS = --fontsize 9.0 \
			--linkstyle plain \
			--linkcolor green

MD = pages/index.md \
	 chapters/installation.md \
	 chapters/modules.md

HTML = $(MD:.md=.html)

book.pdf: $(HTML)
	htmldoc $(HTML) $(PDF_FLAGS) --outfile $@

book.html: $(HTML)
	cat $(HTML) > book.html

%.html: %.md
	ronn --pipe --fragment $< \
		| sed -E 's/<h1>([^ ]+) - /<h1>/' \
		> $@

view: book.pdf
	open book.pdf

clean:
	rm -f book.*
	rm -f pages/*.html
	rm -f chapters/*.html

.PHONY: view clean