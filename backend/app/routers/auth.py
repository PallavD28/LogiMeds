from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import RegisterSchema, LoginSchema, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):


    print(f"--- DEBUG: DATA.PASSWORD TYPE: {type(data.password)} ---")
    print(f"--- DEBUG: DATA.PASSWORD VALUE: {data.password} ---")
    
    tenant = Tenant(
        company_name=data.company_name,
        gst_number=data.gst_number,
        email=data.email
    )
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    admin_user = User(
        tenant_id=tenant.id,
        name="Admin",
        email=data.email,
        password_hash=hash_password(data.password),
        role="admin"
    )

    db.add(admin_user)
    db.commit()

    return {"message": "Tenant registered successfully"}


@router.post("/login", response_model=TokenResponse)
def login(data: LoginSchema, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(user.id),
        "tenant_id": str(user.tenant_id),
        "role": user.role
    })

    return {"access_token": token}