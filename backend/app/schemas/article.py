from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.article import ArticleStatus


class ArticlePayload(BaseModel):
    title: str = Field(
        min_length=20,
        max_length=200,
        examples=["Lorem Ipsum Dummy Article"],
    )
    content: str = Field(
        min_length=200,
        examples=[
            (
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris "
                "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "
                "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            )
        ],
    )
    category: str = Field(
        min_length=3,
        max_length=100,
        examples=["Technology"],
    )
    status: ArticleStatus = Field(
        examples=[ArticleStatus.DRAFT],
    )

    @field_validator("title", "content", "category", mode="before")
    @classmethod
    def strip_text(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value


class ArticleCreate(ArticlePayload):
    pass


class ArticleUpdate(ArticlePayload):
    pass


class ArticleResponse(ArticlePayload):
    id: int
    created_date: datetime
    updated_date: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Lorem Ipsum Dummy Article",
                "content": (
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
                    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris "
                    "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "
                    "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                ),
                "category": "Technology",
                "status": "draft",
                "created_date": "2026-10-30T10:00:00",
                "updated_date": "2026-10-30T10:00:00",
            }
        },
    )



class ErrorResponse(BaseModel):
    message: str
    errors: dict[str, str] | None = None
