## Description

Test Nest with ClickHouse service

## Installation

```shell
npm i
```

## Running the app

First you need to copy `.env.example` to `.env`

Start ClickHouse in Docker
```shell
make up
```

Run the service
```shell
make start
```

Stop ClickHouse
```shell
make down
```

By default app is listening on http://localhost:3000


### Database

Create migration
```shell
make clickhouse-generate name=<some-name>
```

Run migrations
```shell
make clickhouse-migrate
```
