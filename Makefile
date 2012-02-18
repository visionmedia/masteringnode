
PDF_FLAGS = --fontsize 8.0 \
	--linkstyle plain \
	--linkcolor green \
	--embedfonts \
	--footer "c 1" \
	--format pdf12

MD = 	 chapters/all.md

HTML = $(MD:.md=.html)

all: clean book.html book.pdf book.mobi book.epub

regenerate: all clean_html
	@echo "\nRunning: $@"
	git commit -a -m 'Regenerated book' && echo done

book.pdf: book.html
	@echo "\nGenerating: $@"
	htmldoc docs/book.html $(PDF_FLAGS) -f docs/$@

book.html: clean pages/head.html pages/tail.html $(HTML)
	@echo "\nGenerating: $@"
	cat pages/head.html $(HTML) pages/tail.html > docs/book.html

%.html: %.md
	node tools/doctool/doctool.js pages/singletemplate.html $< > $@

book.mobi: book.html
	@echo "\nGenerating: $@"
	ebook-convert docs/book.html docs/book.mobi --output-profile kindle \
		--dont-compress \
		--mobi-ignore-margins \
		--pretty-print \
		--insert-blank-line \
		--margin-left 50 \
		--margin-right 50 \
		--margin-top 50 \
		--margin-bottom 50 \
		--title "Mastering Node" \
		--authors "TJ Holowaychuk, Jim Schubert" \
		--tags "Mastering Node, JavaScript, node.js" \
		--language en \
		--cover pages/cover.jpg \
		--disable-fix-indents \
		--disable-font-rescaling 

book.epub: book.html
	@echo "\nGenerating: $@"
	ebook-convert docs/book.html docs/book.epub \
		--title "Mastering Node" \
		--no-default-epub-cover \
		--authors "TJ Holowaychuk, Jim Schubert" \
		--tags "Mastering Node, JavaScript, node.js" \
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

gh-pages:
	@echo "\nCloning masteringnode.git..."
	[ ! -d "gh-pages" ] && git clone git@github.com:jimschubert/masteringnode.git gh-pages
	@echo "\nChecking out gh-pages..."
	cd gh-pages && git checkout gh-pages
	@echo "\nCopying site contents into gh-pages"
	cp -r ./site/* ./gh-pages/
	@echo "\nDone. Be sure to commit and push the files under gh-pages"

.PHONY: view clean regenerate
