init: install up

install:
	npm i

up:
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose down --remove-orphans

audit:
	npm audit --audit-level=critical

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
