from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class UserInDB(UserBase):
    id: int
    hashed_password: str
    preferences: Optional[Dict[str, Any]] = None

class User(UserBase):
    id: int
    preferences: Optional[Dict[str, Any]] = None
    
    model_config = {"from_attributes": True}

# Book schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    genre: Optional[str] = None
    description: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class Book(BookBase):
    id: int
    available: bool = True
    
    model_config = {"from_attributes": True}

# Borrowing schemas
class BorrowBase(BaseModel):
    user_id: int
    book_id: int

class BorrowCreate(BorrowBase):
    pass

# Backward-compatible alias
class BorrowingCreate(BorrowBase):
    pass

class Borrow(BorrowBase):
    id: int
    borrow_date: str
    return_date: Optional[str] = None
    returned: bool = False
    
    model_config = {"from_attributes": True}

# AI Recommendation schemas
class RecommendationRequest(BaseModel):
    user_id: int
    limit: int = 5

class RecommendationResponse(BaseModel):
    book_id: int
    title: str
    author: str
    confidence: float

# Search schemas
class SearchRequest(BaseModel):
    query: str
    limit: int = 10

class SearchResponse(BaseModel):
    books: List[Book]

# Health check
class HealthResponse(BaseModel):
    status: str
    database: bool
    ai_models: Dict[str, bool]

# Add these to the BOTTOM of your schemas.py file (after the existing content)

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None

# Response schemas for API endpoints
class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

# Health check schema
class HealthCheck(BaseModel):
    status: str
    timestamp: Any
    service: str
    database: bool
    ai_models: bool
    uptime: float

# Book response
class BookResponse(BaseModel):
    id: UUID
    title: str
    author: str
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    views: Optional[int] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    cover_image_url: Optional[str] = None

    model_config = {"from_attributes": True}

# Search result
class SearchResult(BaseModel):
    book: BookResponse
    similarity_score: float

    model_config = {"from_attributes": True}

# Borrowing response
class BorrowingResponse(BaseModel):
    id: UUID
    user_id: UUID
    book_id: UUID
    borrowed_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    returned_date: Optional[datetime] = None
    status: Optional[str] = None
    fine_amount: Optional[float] = None
    book: Optional[BookResponse] = None

    model_config = {"from_attributes": True}

# Reading session schemas
class ReadingSessionCreate(BaseModel):
    book_id: UUID
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    pages_read: Optional[int] = None
    progress_percentage: Optional[float] = None
    device_info: Optional[Dict[str, Any]] = None

class ReadingSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    book_id: UUID
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    pages_read: Optional[int] = None
    progress_percentage: Optional[float] = None
    device_info: Optional[Dict[str, Any]] = None

    model_config = {"from_attributes": True}

# Reading stats
class ReadingStats(BaseModel):
    total_books_read: int
    total_pages_read: int
    total_reading_time: int
    current_streak: int
    longest_streak: int
    favorite_genre: str
    monthly_reading: Dict[str, int]

# Reviews
class ReviewCreate(BaseModel):
    book_id: UUID
    rating: int
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    book_id: UUID
    rating: int
    comment: Optional[str] = None
    helpful_count: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Recommendations
class BookRecommendation(BaseModel):
    book: BookResponse
    score: float
    reason: str

    model_config = {"from_attributes": True}

# Analytics
class DemandPredictionResponse(BaseModel):
    id: UUID
    book_id: UUID
    prediction_date: Optional[datetime] = None
    predicted_demand: Optional[int] = None
    confidence_score: Optional[float] = None
    factors_considered: Optional[Dict[str, Any]] = None

    model_config = {"from_attributes": True}

class LibraryAnalytics(BaseModel):
    total_books: int
    total_users: int
    active_borrowings: int
    popular_books: List[BookResponse]
    demand_predictions: List[DemandPredictionResponse]
 
