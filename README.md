# dede-back-end
Back end service for Dede passenger information system. Website: https://dedriver.org

## Overview
This repository provides a command line interface service for Linux based operating system. As a back end service, it interacts between Dede app and Dede front end service.

## Setup for development environment
Run the following command in your favorite GNU/Linux shell to install dependenies.
```
npm i
```
Run the following command in your favorite GNU/Linux shell if you fancy log messages for debugging.
```
export DEBUG=$DEBUG,dedebe,mongoose
```
Run the following command in your favorite GNU/Linux shell to start the service.
```
npm run dev
