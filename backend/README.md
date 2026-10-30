# Sharing Vision Article API

## Menjalankan dengan container

### 1.Pastikan Podman machine aktif Jalankan environment development

```bash
cd backend
podman-compose build

podman-compose up -d
```

Alamat development:

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### Menghentikan service

```bash
podman compose down
```

Menghapus service sekaligus volume data MySQL development:

```bash
podman compose down -v
```

Menjalankan migration secara manual jika diperlukan:

```bash
podman compose exec api alembic upgrade head
```

## Menjalankan tanpa container

Requirement: Python 3.11+ dan MySQL 8+.

Buat database dan user:

```sql
CREATE DATABASE article CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'user1'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON article.* TO 'user1'@'localhost';
FLUSH PRIVILEGES;
```

Kemudian jalankan:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```