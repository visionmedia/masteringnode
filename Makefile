
PDF_FLAGS = --fontsize 9.0 \
	--linkstyle plain \
	--linkcolor green \
	--embedfonts \
	--footer "c 1" \
	--format pdf12 \
	--left 0.5in \
	--right 0.2in \
        --jpeg=85


MD = 	 chapters/intro.md \
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

all: book.html book.pdf book.mobi book.epub

regenerate: clean all clean_html
	@echo "\nRunning: $@"
	git commit -a -m 'Regenerated book' && echo done

book.pdf: $(HTML)
	@echo "\nGenerating: $@"
	htmldoc $(HTML) $(PDF_FLAGS) -f docs/$@

book.html: pages/head.html pages/tail.html $(HTML)
	@echo "\nGenerating: $@"
	cat pages/head.html $(HTML) pages/tail.html > docs/book.html

%.html: %.md
	node tools/doctool/doctool.js pages/template.html $< > $@

book.mobi:
	@echo "\nGenerating: $@"
	ebook-convert docs/book.html docs/book.mobi --output-profile kindle

book.epub:
	@echo "\nGenerating: $@"
	ebook-convert docs/book.html docs/book.epub \
		--title "Mastering Node" \
		--no-default-epub-cover \
		--authors "TJ Holowaychuk, Jim Schubert" \
		--language en \
		--cover pages/cover.jpg

view: book.pdf
	open docs/book.pdf

clean: clean_books clean_html

clean_books:
	@echo "\nRemoving book files..."
	rm -f docs/book.*
clean_html:
	@echo "\nRemoving html files..."
	rm -f chapters/*.html

.PHONY: view clean regenerate
