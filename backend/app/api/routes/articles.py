from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.article import ArticleRepository
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate, ErrorResponse

router = APIRouter(prefix="/article", tags=["articles"])
DatabaseSession = Annotated[Session, Depends(get_db)]
ArticleID = Annotated[int, Path(ge=1)]


@router.post(
    "/",
    response_model=ArticleResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": ErrorResponse}},
)
def create_article(payload: ArticleCreate, db: DatabaseSession) -> ArticleResponse:
    return ArticleRepository(db).create(payload)


@router.get("/{limit}/{offset}", response_model=list[ArticleResponse])
def list_articles(
    db: DatabaseSession,
    limit: Annotated[int, Path(gt=0, le=100)],
    offset: Annotated[int, Path(ge=0)],
) -> list[ArticleResponse]:
    return ArticleRepository(db).list(limit, offset)


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
    responses={404: {"model": ErrorResponse}},
)
def get_article(article_id: ArticleID, db: DatabaseSession) -> ArticleResponse:
    article = ArticleRepository(db).get(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, data="Article not found")
    return article


@router.put(
    "/{article_id}",
    response_model=ArticleResponse,
    responses={404: {"model": ErrorResponse}},
)
@router.patch(
    "/{article_id}",
    response_model=ArticleResponse,
    responses={404: {"model": ErrorResponse}},
)
def update_article(
    article_id: ArticleID, payload: ArticleUpdate, db: DatabaseSession
) -> ArticleResponse:
    repository = ArticleRepository(db)
    article = repository.get(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, data="Article not found")
    return repository.update(article, payload)


@router.delete(
    "/{article_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}},
)
def delete_article(article_id: ArticleID, db: DatabaseSession) -> None:
    repository = ArticleRepository(db)
    article = repository.get(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, data="Article not found")
    repository.delete(article)
