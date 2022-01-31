# Dede-server

server for the Designated Driver (Dede) free software community
[project](https://dedriver.org)

## Table of Contents
0. [General](#General)
1. [Quick Start Guide](#Quick-Start-Guide)
2. [Setup](#Setup)

# General

This repository provides a service for Linux based operating system.
As a back end service,
this server interacts between
[Dede app](https://github.com/Dede-Designated-Driver/dede-android)
and
[Dede front end](https://github.com/Dede-Designated-Driver/dede-front-end).

# Quick Start Guide

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

Run the following command in your favorite GNU/Linux shell to start the service for production mode.
```
npm run start
```

# [Setup](doc/setup.md)
