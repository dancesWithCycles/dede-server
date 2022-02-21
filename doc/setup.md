# Dede-server Setup

Use the following checklist to setup this service

## Preparation

* check out git repositories onto a development system as descirpted in the
[Quick Start Guide](../README.md#Quick-Start-Guide)
but do not run ```npm i```

* archive project and copy onto host system
```
cd ..
tar -czvf dede-server.tar.gz --exclude={"dede-server/.git","dede-server/dede-mongo/.git"} dede-server/
scp -p <host ssh port> dede-server.tar.gz  <user>@<host>.<domain>:/home/<user>/
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

* add service port to the firewall (e.g. nftables or ufw)

## Automatic Service Setup For Production

* create folder for deployment
```
sudo mkdir -p /opt/dede-server
```

* copy service source into the working folder
```
sudo mv ~/dede-server.tar.gz /opt
sudo tar -xzf /home/begerad/dede-server.tar.gz -C /opt/
```

* set up service environment on host system
```
cd /opt/dede-server/
sudo vi .env
MONGOOSE_DEBUGGING=<define debugging config (true/false)>
MONGOOSE_DEBUG=<define debugging config (true/false)>
MONGOOSE_DB=<define database name>
MONGOOSE_PORT=<define database port (default: 27017)>
MONGOOSE_HOST=<deinfe database host (default: 127.0.0.1)>
MONGOOSE_UP=
MONGOOSE_TYPE=mongodb://
PORT=<define service port>
NODE_ENV=production
```

* create group and user ```dede-server```
following this [setup](https://github.com/Software-Ingenieur-Begerad/setup/blob/main/doc/create-grp-usr.md)

* adjust group and user privileges
```
sudo chown -R dede-server:dede-server /opt/dede-server
```

* prepare pm2 following this [setup](https://github.com/Software-Ingenieur-Begerad/setup/blob/main/doc/setup-pm2.md)

* start the service as npm start script with PM2
```
cd /opt/dede-server
pm2 start --name dede-server npm -- start --watch
```

* register/save the current list of processes you want to manage using PM2 so that they will re-spawn at system boot (every time it is expected or an unexpected server restart)
```
pm2 save
```

* restart your system, and check if all the serviceis running under PM2
```
pm2 ls
```
or
```
pm2 status
```

## Manual Service Invocation For Development
* call service manually
```
npm i
export DEBUG=$DEBUG,dedebe
export DEBUG=$DEBUG,dede-mongo,mongoose
npm run dev
```
