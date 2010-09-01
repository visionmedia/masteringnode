
PDF_FLAGS = --fontsize 9.0 \
			--linkstyle plain \
			--linkcolor green \
			--embedfonts \
			--footer "c 1" \
			--no-toc

MD = pages/index.md \
	 chapters/installation.md \
	 chapters/modules.md \
	 chapters/globals.md \
	 chapters/events.md \
	 chapters/buffers.md \
	 chapters/streams.md \
	 chapters/fs.md \
	 chapters/tcp.md \
	 chapters/http.md \
	 chapters/connect.md \
	 chapters/express.md \
	 chapters/testing.md \
	 chapters/deploy.md

HTML = $(MD:.md=.html)

all: book.html book.pdf

book.pdf: $(HTML)
	htmldoc $(HTML) $(PDF_FLAGS) --outfile $@

book.html: pages/head.html pages/tail.html $(HTML)
	cat pages/head.html $(HTML) pages/tail.html > book.html

%.html: %.md
	ronn --pipe --fragment $< \
		| sed -E 's/<h1>([^ ]+) - /<h1>/' \
		> $@

book.mobi:
	ebook-convert book.html book.mobi --output-profile kindle

book.epub:
	ebook-convert book.html book.epub

view: book.pdf
	open book.pdf

clean:
	rm -f book.*
	rm -f chapters/*.html

.PHONY: view clean