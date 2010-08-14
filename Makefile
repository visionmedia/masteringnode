
PDF_FLAGS = --fontsize 9.0 \
			--linkstyle plain \
			--linkcolor green \
			--embedfonts \
			--no-toc

MD = pages/index.md \
	 chapters/installation.md \
	 chapters/modules.md \
	 chapters/globals.md \
	 chapters/events.md \
	 chapters/streams.md \
	 chapters/fs.md \
	 chapters/tcp.md \
	 chapters/buffers.md \
	 chapters/http.md \
	 chapters/connect.md \
	 chapters/express.md \
	 chapters/testing.md \
	 chapters/deploy.md

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