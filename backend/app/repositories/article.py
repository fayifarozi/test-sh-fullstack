from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate


class ArticleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: ArticleCreate) -> Article:
        article = Article(**payload.model_dump())
        self.db.add(article)
        self.db.commit()
        self.db.refresh(article)
        return article

    def list(self, limit: int, offset: int) -> list[Article]:
        statement = (
            select(Article)
            .order_by(Article.created_date.desc(), Article.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(statement).all())

    def get(self, article_id: int) -> Article | None:
        return self.db.get(Article, article_id)

    def update(self, article: Article, payload: ArticleUpdate) -> Article:
        for field, value in payload.model_dump().items():
            setattr(article, field, value)
        self.db.commit()
        self.db.refresh(article)
        return article
        
    def delete(self, article: Article) -> None:
        self.db.delete(article)
        self.db.commit()
