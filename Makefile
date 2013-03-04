JS_COMPILER = \
	./lib/uglifyjs/bin/uglifyjs

JSDOCTEMPLATEDIR = \
		/local/tools/jsdoc-toolkit/templates/jsdoc

JSDOC_COMPILER = \
		/local/tools/jsdoc-toolkit/jsrun.sh -t=$(JSDOCTEMPLATEDIR)

all: \
	full \
	min

full: \
	vq.js \
	vq.circvis.js \
	vq.scatterplot.js \

min: \
	vq.min.js \
	vq.circvis.min.js \
	vq.scatterplot.min.js \

vq.js: \
	src/core/base.js \
	src/core/vis.js \
	src/core/models.js \
	src/core/utils.js \
	src/core/events.js \
	src/core/hovercard.js 	

vq.circvis.js: \
	src/circvis/circvis.js \
	src/circvis/wedge.js \
	src/circvis/ticks.js \
	src/circvis/network.js \
	src/circvis/circvis_api.js \
	src/circvis/predicate.js \
	src/circvis/circvisdata.js \
	src/circvis/wedgedata.js 

vq.scatterplot.js: \
	src/scatterplot/scatterplot.js \
	src/scatterplot/scatterplot.jquery.js 


%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

vq.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a+w $@

vq%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a+w $@

docs:
	mkdir docs
	$(JSDOC_COMPILER) . -d=docs

clean_docs:
	rm -rf docs

clean:
	rm -f vq*.js

make_zip:
	zip visquick_full.zip *.js
	zip visquick_min.zip *.min.js
