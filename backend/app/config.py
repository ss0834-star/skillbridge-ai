from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://skillbridge:skillbridge@postgres:5432/skillbridge"
    REDIS_URL: str = "redis://redis:6379"

    # Auth
    JWT_SECRET: str = "supersecretjwtkey2024skillbridge"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7

    # App
    APP_NAME: str = "SkillBridge AI"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://frontend:3000"]

    # AI Provider: "openai" | "gemini" | "mock"
    AI_PROVIDER: str = "mock"
    MOCK_AI_MODE: bool = True

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Gemini
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # AI behaviour controls
    AI_CACHE_TTL_SECONDS: int = 86400
    AI_MAX_INPUT_CHARS: int = 12000
    AI_MAX_OUTPUT_TOKENS: int = 1200
    AI_REQUEST_TIMEOUT_SECONDS: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
