clean:
	rm -rf data

setup:
	mkdir data
	mkdir data/users
	chmod -R 0777 data

resetup: clean setup

