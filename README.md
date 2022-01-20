# Dede-server
Server for Dede passenger information system. Website: https://dedriver.org

## Overview
This repository provides a command line interface service for Linux based operating system. As a back end service, this server interacts between Dede app and Dede front end service.

## Preparation
Run the following command in your favorite GNU/Linux shell to install dependenies.
```
npm i
```
Checkout the following git repository into this project root directory to enable access to MongoDB data base.
```
git clone https://github.com/dancesWithCycles/dede-mongo.git
```
## Development setup
Run the following command in your favorite GNU/Linux shell if you fancy log messages for debugging.
```
export DEBUG=$DEBUG,dedebe
```
Run the following command in your favorite GNU/Linux shell to start the service in development mode.
```
npm run dev
```
## Production deployment
Run the following command in your favorite GNU/Linux shell to start the service for production mode.
```
npm run start
```
