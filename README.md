## Description

Test Nest with ClickHouse service

## Installation

```bash
$ npm i
```

## Running the app

First you need to copy `.env.example` to `.env`

Start ClickHouse in Docker
```bash
$ make up
```

Run the service
```bash
$ make start
```

Stop ClickHouse
```bash
$ make down
```

By default app is listening on http://localhost:3000