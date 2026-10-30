"""create posts table

Revision ID: 20241201_0001
Revises:
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20241201_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column(
            "created_date",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_date",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum("publish", "draft", "thrash", name="article_status", native_enum=False),
            nullable=False,
        ),
        sa.CheckConstraint("CHAR_LENGTH(title) >= 20", name="ck_posts_title_min_length"),
        sa.CheckConstraint("CHAR_LENGTH(content) >= 200", name="ck_posts_content_min_length"),
        sa.CheckConstraint("CHAR_LENGTH(category) >= 3", name="ck_posts_category_min_length"),
        sa.PrimaryKeyConstraint("id"),
        mysql_charset="utf8mb4",
        mysql_collate="utf8mb4_unicode_ci",
    )
    op.create_index("ix_posts_created_date", "posts", ["created_date"], unique=False)
    op.create_index("ix_posts_status", "posts", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_posts_status", table_name="posts")
    op.drop_index("ix_posts_created_date", table_name="posts")
    op.drop_table("posts")
