# Dede-server

server for the Designated Driver (Dede) free software community
[project](https://dedriver.org)

## Table of Contents
0. [General](#General)
1. [Quick Start Guide](#Quick-Start-Guide)
2. [Setup](doc/setup.md)

# General

This repository provides a service for Linux based operating system.
As a back end service,
this server interacts between
[Dede app](https://github.com/Dede-Designated-Driver/dede-android)
and
[Dede front end](https://github.com/Dede-Designated-Driver/dede-front-end).

# Quick Start Guide

## Preparation

* check out project on a GNU/Linux development system and change into the project root folder
```
git clone https://github.com/Dede-Designated-Driver/dede-server.git
cd dede-server
```

* run the following instruction to install dependenies.
```
npm i
```

* checkout the following git repository into this project root folder to enable access to MongoDB data base
```
git clone https://github.com/dancesWithCycles/dede-mongo.git
```

## Development setup

* run the following instruction if you fancy log messages for debugging.
```
export DEBUG=$DEBUG,dedebe
```

* run the following instruction to start the service in development mode.
```
npm run dev

```

## Production deployment

* run the following instrction to start the service for production mode.
```
npm run start
```
