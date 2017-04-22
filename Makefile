clean:
	rm -rf data

setup:
	mkdir data
	mkdir data/users
	echo 0 > data/global_id.txt
	chmod -R 0777 data
	sudo chown -R nobody:nobody data

resetup: clean setup

