# Dede-server Setup

Use the following checklist to setup this service

* check out git repositories onto a development system as descirpted in the
[Quick Start Guide](../README.md#Quick-Start-Guide)
but do not run ```npm i```

* archive project and copy onto host system
```
cd ..
tar -czvf dede-server.tar.gz dede-server/
scp dede-server.tar.gz  <user>@<host>.<domain>:/home/<user>/
```

* [Setup Node.js and NPM](https://github.com/Software-Ingenieur-Begerad/setup/blob/main/doc/setup-npm.md)

* install MongoDB dependencies
```
sudo apt install dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl --no-install-recommends
```

* install MongoDB GPG key
```
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
```

* add MongoDB repository to apt sources list
```
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
```
NOTE: If you noticed the command had Buster instead of Bullseye, do not panic, the MongoDB Community Edition does not have a separate repository for Debian Bullseye. However, the continued work and development in Buster works and is compatible.

* install MongoDB
```
sudo apt-get update
sudo apt install mongodb-org --no-install-recommends
```

* start and activate MondoDB
```
sudo systemctl enable mongod --now
```

* verify installation
```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
systemctl status mongod
```

* set up service environment on host system
```
tar -xzf ~/dede-server.tar.gz -C /opt
cd /opt/dede-server/
sudo vi .env
MONGOOSE_DEBUGGING=true
MONGOOSE_DEBUG=true
MONGOOSE_DB=dede-server-test
MONGOOSE_PORT=27017
MONGOOSE_HOST=127.0.0.1
MONGOOSE_UP=
MONGOOSE_TYPE=mongodb://
PORT=99999
#NODE_ENV=production
```

* add service port to the firewall (e.g. nftables or ufw)

* call service manually
```
npm i
export DEBUG=$DEBUG,dedebe
export DEBUG=$DEBUG,dede-mongo,mongoose
npm run dev
```
