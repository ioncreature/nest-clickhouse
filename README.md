## Description

Test Nest with ClickHouse service

## Work with submodules
This repo contains submodules. Please install them before proceeding.
### To clone this repo with submodules:
```
git clone --recurse-submodules https://github.com/ioncreature/nest-clickhouse.git
```
### To pull submodules changes into existing repo:
```
git submodule update --init --recursive
```

## Setup .env
Copy `.env.example` to `.env` and make changes if needed.


## Installation

```shell
npm i
```

## Get ready container
Start ClickHouse in Docker
```shell
make up
```

## Init Database migrations
```shell
make clickhouse-generate name=init
```

## Working with the app
### Run the app
```shell
make start
```
By default app is listening on http://localhost:3000

### Stop the app
```shell
make down
```


## Working with Database migrations
### To create migration
```shell
make clickhouse-generate name=<some-name-for-migration>
```

### To run migrations
```shell
make clickhouse-migrate
```
