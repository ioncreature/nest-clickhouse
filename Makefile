init: install up

install:
	npm i

up:
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose down --remove-orphans

audit:
	npm audit --audit-level=critical

build:
	npm run build

start:
	npm start

dev:
	npm run start:dev

# Code style
lint-fix:
	npx eslint "{src,test}/**/*.ts" --fix

lint:
	npx eslint "{src,test}/**/*.ts"

format-fix:
	npx prettier --write "{src,test}/**/*.ts"

# ClickHouse
clickhouse-migrate:
	npx ts-node -r tsconfig-paths/register src/scripts/run-migrations.ts

clickhouse-generate:
	npx ts-node -r tsconfig-paths/register src/scripts/generate-migration.ts -- --name=$(name)

