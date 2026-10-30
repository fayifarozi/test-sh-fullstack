.PHONY: install dev migrate-up migrate-down test lint format

install:
	python -m pip install -r requirements-dev.txt

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

migrate-up:
	alembic upgrade head

migrate-down:
	alembic downgrade -1

test:
	pytest

lint:
	ruff check .

format:
	ruff format .
