@echo build gd3d
@cd gd3d
@call tsc
@cd ..

@echo build code
@cd code
@call tsc
@cd ..

REM @echo mix up
REM @cd lib
REM @call uglifyjs gd3d.js -m -c -o gd3d.min.js

@echo build done.