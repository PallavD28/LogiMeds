from pydantic import BaseModel, EmailStr, Field

class RegisterSchema(BaseModel):
    company_name: str
    gst_number: str | None = None
    email: EmailStr
    password: str = Field(..., min_length=6, max_length= 64)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length= 64)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    