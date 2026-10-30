"""seed 21 dummy posts

Revision ID: 20261030_0002
Revises: 20241201_0001
"""

from collections.abc import Sequence
from datetime import datetime, timedelta

import sqlalchemy as sa
from alembic import op

revision: str = "20261030_0002"
down_revision: str | None = "20241201_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SEED_TITLE_PREFIX = "Lorem Ipsum Dummy Article"

LOREM_CONTENT = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor "
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud "
    "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure "
    "dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit "
    "anim id est laborum."
)


def upgrade() -> None:
    posts = sa.table(
        "posts",
        sa.column("title", sa.String(length=200)),
        sa.column("content", sa.Text()),
        sa.column("category", sa.String(length=100)),
        sa.column("created_date", sa.DateTime()),
        sa.column("updated_date", sa.DateTime()),
        sa.column("status", sa.String(length=100)),
    )

    statuses = ("publish", "draft", "thrash")
    categories = ("Technology", "Backend", "Programming")
    now = datetime.now()

    op.bulk_insert(
        posts,
        [
            {
                "title": f"{SEED_TITLE_PREFIX} {number:02d}",
                "content": f"{LOREM_CONTENT} Article number {number:02d}.",
                "category": categories[(number - 1) % len(categories)],
                "status": statuses[(number - 1) % len(statuses)],
                "created_date": now - timedelta(days=21 - number),
                "updated_date": now - timedelta(days=21 - number),
            }
            for number in range(1, 22)
        ],
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM posts WHERE title LIKE :title_pattern").bindparams(
            title_pattern=f"{SEED_TITLE_PREFIX}%"
        )
    )
