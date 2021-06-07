# Installation
## Install PHP
	sudo apt install php php-mbstring php-curl php-xml php-sqlite3
## Install Composer
	curl -s https://getcomposer.org/installer | php
	sudo mv ./composer.phar /usr/bin/composer
## Install PHP packages
	composer updates
## Install npm
	sudo apt install npm
## Install node modules
	npm update
## Generate front-end
	npm run development
## Generate application encryption key
	php artisan key: generate 
## Setup .env file

## Create a local database
	touch database/database.sqlite
	php artisan migrate

# Development
## Start local webserver
	php artisan serve
## Start the websocket server
	php artisan websocket:serve
## Start the server loop
	php artisan queue:work
## Update npm
	npn run watch


# Troubleshooting
## Scores not appearing
Go to evgp.globaleee.org/test-latency and try restarting the counter

