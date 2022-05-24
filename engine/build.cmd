@echo build src
@cd src
@call tsc
@cd ..

@echo build code
@cd code
@call tsc
@cd ..

REM @echo mix up
REM @cd lib
REM @call uglifyjs src.js -m -c -o src.min.js

@echo build done.