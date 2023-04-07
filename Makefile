up: run-services

down:
	docker-compose down --remove-orphans

run-services:
	docker-compose -f docker-compose.yml up -d

audit:
	npm audit --audit-level=critical

start:
	npm start

# Code style
lint-fix:
	npx eslint "{src,test}/**/*.ts" --fix

lint:
	npx eslint "{src,test}/**/*.ts"

format-fix:
	npx prettier --write "{src,test}/**/*.ts"
