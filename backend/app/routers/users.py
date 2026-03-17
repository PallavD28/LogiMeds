from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.auth import RegisterSchema
from app.core.security import hash_password
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_me(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(
        Tenant.id == current_user.tenant_id
    ).first()
    return {
        "id": str(current_user.id),
        "tenant_id": str(current_user.tenant_id),
        "email": current_user.email,
        "role": current_user.role,
        "company_name": tenant.company_name if tenant else None
    }

@router.post("/create-operator")
def create_operator(
    data: RegisterSchema,
    current_admin = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == data.email,
        User.tenant_id == current_admin.tenant_id
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(
        tenant_id=current_admin.tenant_id,
        name="Operator",
        email=data.email,
        password_hash=hash_password(data.password),
        role="operator"
    )

    db.add(new_user)
    db.commit()

    return {"message": "Operator created Successfully"}