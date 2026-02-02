from pydantic import BaseModel, EmailStr, validator, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

# ========== ENUMS ==========
class UserRole(str, Enum):
    READER = "reader"
    LIBRARIAN = "librarian"
    ADMIN = "admin"

class Genre(str, Enum):
    FICTION = "fiction"
    NON_FICTION = "non_fiction"
    ROMANCE = "romance"
    HORROR = "horror"
    SCIFI = "scifi"
    FANTASY = "fantasy"
    BIOGRAPHY = "biography"
    SELF_HELP = "self_help"
    REFERENCE = "reference"

class AgeGroup(str, Enum):
    CHILD = "child"
    TEEN = "teen"
    ADULT = "adult"
    SENIOR = "senior"

class BookStatus(str, Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    RESERVED = "reserved"
    OVERDUE = "overdue"

# ========== USER SCHEMAS ==========
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    age_group: Optional[AgeGroup] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    age_group: Optional[AgeGroup] = None
    preferences: Optional[Dict[str, Any]] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID
    role: UserRole
    preferences: Dict[str, Any]
    streak_count: int
    total_reading_time: int
    reading_level: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)

# ========== AUTH SCHEMAS ==========
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 1800
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)

class TokenData(BaseModel):
    user_id: Optional[UUID] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None

# ========== BOOK SCHEMAS ==========
class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=200)
    isbn: str = Field(..., pattern=r'^(\d{10}|\d{13})$')
    genre: Genre
    sub_genre: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    summary: Optional[str] = None
    publication_year: Optional[int] = Field(None, ge=1000, le=2100)
    publisher: Optional[str] = Field(None, max_length=100)
    language: str = "en"
    pages: Optional[int] = Field(None, ge=1)
    total_copies: int = Field(1, ge=1)
    cover_image_url: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    author: Optional[str] = Field(None, min_length=1, max_length=200)
    genre: Optional[Genre] = None
    description: Optional[str] = None
    total_copies: Optional[int] = Field(None, ge=1)
    available_copies: Optional[int] = Field(None, ge=0)
    cover_image_url: Optional[str] = None

class BookResponse(BookBase):
    id: UUID
    available_copies: int
    location: Optional[str]
    shelf_number: Optional[str]
    views: int
    rating: float = Field(0.0, ge=0.0, le=5.0)
    total_ratings: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)

# ========== BORROWING SCHEMAS ==========
class BorrowingBase(BaseModel):
    book_id: UUID
    due_days: int = Field(14, ge=1, le=30)

class BorrowingCreate(BorrowingBase):
    pass

class BorrowingResponse(BaseModel):
    id: UUID
    user: UserResponse
    book: BookResponse
    borrowed_date: datetime
    due_date: datetime
    returned_date: Optional[datetime]
    status: BookStatus
    fine_amount: float
    renewed_count: int
    
    model_config = ConfigDict(from_attributes=True)

# ========== READING SESSION SCHEMAS ==========
class ReadingSessionBase(BaseModel):
    book_id: UUID
    pages_read: int = Field(0, ge=0)
    progress_percentage: float = Field(..., ge=0.0, le=100.0)
    device_info: Optional[Dict[str, Any]] = None

class ReadingSessionCreate(ReadingSessionBase):
    pass

class ReadingSessionResponse(ReadingSessionBase):
    id: UUID
    user_id: UUID
    start_time: datetime
    end_time: Optional[datetime]
    duration_minutes: Optional[int]
    
    model_config = ConfigDict(from_attributes=True)

# ========== REVIEW SCHEMAS ==========
class ReviewBase(BaseModel):
    book_id: UUID
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: UUID
    user_id: UUID
    helpful_count: int
    is_verified_purchase: bool
    created_at: datetime
    updated_at: Optional[datetime]
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)

# ========== AI RECOMMENDATION SCHEMAS ==========
class RecommendationRequest(BaseModel):
    user_id: Optional[UUID] = None
    limit: int = Field(10, ge=1, le=50)
    genres: Optional[List[Genre]] = None

class BookRecommendation(BaseModel):
    book: BookResponse
    score: float = Field(..., ge=0.0, le=1.0)
    reason: str
    match_type: str

# ========== SEARCH SCHEMAS ==========
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    limit: int = Field(20, ge=1, le=100)
    filters: Optional[Dict[str, Any]] = None

class SearchResult(BaseModel):
    book: BookResponse
    similarity_score: float = Field(..., ge=0.0, le=1.0)

# ========== ANALYTICS SCHEMAS ==========
class ReadingStats(BaseModel):
    total_books_read: int
    total_pages_read: int
    total_reading_time: int
    current_streak: int
    longest_streak: int
    favorite_genre: Optional[str]
    monthly_reading: Dict[str, int]

class LibraryAnalytics(BaseModel):
    total_books: int
    total_users: int
    active_borrowings: int
    popular_books: List[BookResponse]
    demand_predictions: List[Dict[str, Any]]

# ========== HEALTH CHECK ==========
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    service: str
    database: bool
    ai_models: Dict[str, bool]
    uptime: float