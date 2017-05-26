@echo build gd3d
@cd gd3d
@call tsc
@cd ..

@echo build code
@cd code
@call tsc
@cd ..

@echo build done.