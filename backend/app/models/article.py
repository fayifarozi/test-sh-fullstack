from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ArticleStatus(str, Enum):
    PUBLISH = "publish"
    DRAFT = "draft"
    THRASH = "thrash"


class Article(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    created_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.current_timestamp()
    )
    updated_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        server_onupdate=func.current_timestamp(),
    )
    status: Mapped[ArticleStatus] = mapped_column(
        SqlEnum(
            ArticleStatus,
            values_callable=lambda statuses: [status.value for status in statuses],
            native_enum=False,
            length=100,
        ),
        nullable=False,
    )
