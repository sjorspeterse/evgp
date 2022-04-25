# Installation
All these commands should be run from the repository root
## Install PHP
	sudo apt install php php-mbstring php-curl php-xml php-sqlite3
## Install Composer
	curl -s https://getcomposer.org/installer | php
	sudo mv ./composer.phar /usr/bin/composer
## Install PHP packages
	composer install
## Install npm/nodejs
	sudo apt install nodejs
## Install node modules
	npm update
## Generate front-end
	npm run development
## Setup .env file
    cp .env.example .env

## Generate application encryption key
	php artisan key:generate

## Create a local database
	touch database/database.sqlite
	php artisan migrate

# Development
Run the following in separate consoles:
## Start local webserver
	php artisan serve
## Start the websocket server
	php artisan websocket:serve
## Start the server loop
	php artisan queue:work
## Update npm
	npn run watch
## Open in browser
    http://localhost:8000/
## Start server loop
    http://localhost:8000/test-latency
    


# Troubleshooting
## Scores not appearing
Go to evgp.globaleee.org/test-latency and try restarting the counter

# SSH access
ssh forge@161.35.118.121

