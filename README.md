# IoT Manager

Simple IoT Dashboard & Device Configuration Tool

## Requirements

- Node 12+
- Npm

## Installation

```bash
git clone https://github.com/hacklabza/iotmanager.git
cd iotmanager/
npm install
cp .env.example .env.developement
```

### Run the server to test your installation

```bash
npm run start
```

## Deployment

```bash
# Copy the environment file for production build
cp .env.example .env.production

# Build the project
npm run build

# Copy to server
scp -r build/* user@server:/home/pi/iotmanager/
scp -r systemd/* user@server:/home/pi/iotmanager/systemd/
```

### Run the server from supervisor

```bash
ssh user@server
sudo cp systemd/iot.manager.service /etc/systemd/system/iot.manager.service
sudo systemctl start iot.manager.service
sudo systemctl enable iot.manager.service
```
