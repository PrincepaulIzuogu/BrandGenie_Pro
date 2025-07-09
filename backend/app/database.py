from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, func, Text
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime, timedelta
import os


# DATABASE CONFIG
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in environment")

Base = declarative_base()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# ------------------------
# SQLALCHEMY MODELS
# ------------------------

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    owner_full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    users = relationship("User", back_populates="company")
    canva_integrations = relationship("CanvaIntegration", back_populates="company")
    teams = relationship("Team", back_populates="company")
    notifications = relationship("Notification", back_populates="company")
    communities = relationship("CommunityPost", back_populates="company")
    google_calendar_integrations = relationship("GoogleCalendarIntegration", back_populates="company")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    temp_code = Column(String, nullable=True)  # 5-digit code for temporary login
    contract_expiry = Column(DateTime, nullable=True)  # entire app access duration
    is_active = Column(Boolean, default=True)
    token_expiry = Column(DateTime, nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    company = relationship("Company", back_populates="users")

    created_at = Column(DateTime, default=func.now())

    # Relationships
    messages = relationship("Message", back_populates="sender")
    uploaded_files = relationship(
        "DriveFile",
        back_populates="uploaded_by_user",
        foreign_keys="DriveFile.uploaded_by_user_id"
    )
    project_memberships = relationship("ProjectMember", back_populates="user", cascade="all, delete-orphan")
    group_memberships = relationship("GroupMember", back_populates="user", cascade="all, delete-orphan")
    tool_permissions = relationship("ToolPermission", back_populates="user", cascade="all, delete-orphan")
    document_permissions = relationship("DocumentPermission", back_populates="user", cascade="all, delete-orphan")




class VerificationToken(Base):
    __tablename__ = "verification_tokens"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    token = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=10))


class CanvaIntegration(Base):
    __tablename__ = "canva_integrations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    canva_account_id = Column(String, nullable=False)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", back_populates="canva_integrations")


class GoogleCalendarIntegration(Base):
    __tablename__ = "google_calendar_integrations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", back_populates="google_calendar_integrations")


class UserCanvaAssignment(Base):
    __tablename__ = "user_canva_assignments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    canva_integration_id = Column(Integer, ForeignKey("canva_integrations.id", ondelete="CASCADE"))
    access_start = Column(DateTime, nullable=False)
    access_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", back_populates="teams")
    messages = relationship("Message", back_populates="team")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"))
    timestamp = Column(DateTime, default=func.now())

    sender = relationship("User", back_populates="messages")
    team = relationship("Team", back_populates="messages")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", back_populates="notifications")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", back_populates="communities")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    all_day = Column(Boolean, default=False)

    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())


# SQLAlchemy model for uploaded media assets
class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filetype = Column(String, nullable=False)
    uploaded_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    uploaded_by_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=func.now())


class KanbanTask(Base):
    __tablename__ = "kanban_tasks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    column_id = Column(Integer, ForeignKey("kanban_columns.id", ondelete="CASCADE"))
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())


class KanbanColumn(Base):
    __tablename__ = "kanban_columns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())

    tasks = relationship("KanbanTask", backref="column", cascade="all, delete-orphan")


class DriveFile(Base):
    __tablename__ = "drive_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filetype = Column(String, nullable=False)
    is_folder = Column(Boolean, default=False)
    path = Column(String, nullable=False)  # e.g., 'My Drive/Campaigns/'
    size = Column(Integer, nullable=True)  # In bytes
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    uploaded_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    modified = Column(DateTime, nullable=True)

    # Relationships
    company = relationship("Company", backref="drive_files")
    uploaded_by_user = relationship("User", back_populates="uploaded_files", foreign_keys=[uploaded_by_user_id])
    document_permissions = relationship("DocumentPermission", back_populates="document", cascade="all, delete-orphan")



class DocumentPermission(Base):
    __tablename__ = "document_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    document_id = Column(Integer, ForeignKey("drive_files.id", ondelete="CASCADE"))
    access_start = Column(DateTime, nullable=False)
    access_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="document_permissions")
    document = relationship("DriveFile", back_populates="document_permissions")



class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String, nullable=False, default="active")

    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime, default=func.now())

    company = relationship("Company", backref="projects", foreign_keys=[company_id])
    created_by_user = relationship("User", foreign_keys=[created_by_user_id])
    created_by_company = relationship("Company", foreign_keys=[created_by_company_id])
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    access_start = Column(DateTime, nullable=False)
    access_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships")





class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=func.now())

    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="group_memberships")



class GroupMessage(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    sender_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    sender_company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=func.now())

    sender_user = relationship("User", foreign_keys=[sender_user_id])
    sender_company = relationship("Company", foreign_keys=[sender_company_id])


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    link = Column(String)
    logo_url = Column(String)  # store image path or URL
    created_at = Column(DateTime, default=datetime.utcnow)

    permissions = relationship("ToolPermission", back_populates="tool", cascade="all, delete-orphan")


class ToolPermission(Base):
    __tablename__ = "tool_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    tool_id = Column(Integer, ForeignKey("tools.id", ondelete="CASCADE"))
    access_start = Column(DateTime, nullable=False)
    access_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="tool_permissions")
    tool = relationship("Tool", back_populates="permissions")




# ------------------------
# PYDANTIC SCHEMAS
# ------------------------

class CompanyCreate(BaseModel):
    company_name: str
    email: EmailStr
    password: str
    owner_full_name: str
    role: str

class CompanyOut(BaseModel):
    id: int
    company_name: str
    email: EmailStr
    owner_full_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class StaffLoginRequest(BaseModel):
    email: EmailStr
    token: str

class AssignmentOut(BaseModel):
    name: str
    access_start: Optional[datetime] = None
    access_end: Optional[datetime] = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    contract_expiry: datetime
    groups: List[str] = []
    tools: List[AssignmentOut] = []
    projects: List[AssignmentOut] = []
    documents: List[AssignmentOut] = []
 

class VerificationTokenCreate(BaseModel):
    email: EmailStr
    token: str
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    token: str

class CanvaIntegrationCreate(BaseModel):
    company_id: int
    access_token: str
    refresh_token: Optional[str]
    expires_at: datetime

    class Config:
        from_attributes = True

class GoogleCalendarIntegrationCreate(BaseModel):
    company_id: int
    access_token: str
    refresh_token: str
    expires_at: datetime

    class Config:
        from_attributes = True

class UserCanvaAssignmentCreate(BaseModel):
    user_id: int
    canva_integration_id: int
    access_start: datetime
    access_end: datetime

    class Config:
        from_attributes = True

class TeamCreate(BaseModel):
    name: str
    company_id: int

class TeamOut(BaseModel):
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str
    sender_id: int
    team_id: int

class MessageOut(BaseModel):
    id: int
    content: str
    sender_id: int
    team_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    title: str
    body: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityPostOut(BaseModel):
    id: int
    author_name: str
    summary: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    all_day: Optional[bool] = False
    company_id: int
    created_by_user_id: Optional[int] = None
    created_by_company_id: Optional[int] = None



class CalendarEventOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    all_day: bool
    created_by: Optional[int]
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ✅ Pydantic schema for request
class CopilotRequest(BaseModel):
    prompt: str

# ✅ Pydantic schema for response
class CopilotResponse(BaseModel):
    response: str


# Pydantic schema for media asset output
class MediaAssetOut(BaseModel):
    id: int
    filename: str
    filepath: str
    filetype: str
    uploaded_by: Optional[int]
    project_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# Pydantic schema for creating asset entry (used optionally)
class MediaAssetCreate(BaseModel):
    filename: str
    filepath: str
    filetype: str
    uploaded_by: Optional[int] = None
    project_id: Optional[int] = None

class KanbanTaskCreate(BaseModel):
    content: str
    column_id: int
    company_id: int

class KanbanTaskOut(BaseModel):
    id: int
    content: str
    column_id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class KanbanColumnCreate(BaseModel):
    title: str
    company_id: int

class KanbanColumnOut(BaseModel):
    id: int
    title: str
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DriveFileCreate(BaseModel):
    filename: str
    filetype: str
    is_folder: bool = False
    path: str
    size: Optional[int] = None
    company_id: int
    uploaded_by_user_id: Optional[int] = None

class DriveFileOut(BaseModel):
    id: int
    filename: str
    filetype: str
    is_folder: bool
    path: str
    size: Optional[int]
    company_id: int
    uploaded_by_user_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True



class ProjectCreate(BaseModel):
    name: str
    end_date: datetime
    status: str = "active"
    company_id: Optional[int] = None
    created_by_user_id: Optional[int] = None
    created_by_company_id: Optional[int] = None
    member_ids: Optional[list[int]] = []

class ProjectOut(BaseModel):
    id: int
    name: str
    end_date: datetime
    status: str
    company_id: Optional[int]
    created_by_user_id: Optional[int]
    created_by_company_id: Optional[int]
    created_at: datetime
    members: list[UserOut]

    class Config:
        from_attributes = True

class ProjectMemberOut(BaseModel):
    id: int
    project_id: int
    user_id: int

    class Config:
        from_attributes = True







class GroupCreate(BaseModel):
    name: str
    company_id: int
    created_by_user_id: Optional[int] = None
    created_by_company_id: Optional[int] = None
    member_ids: Optional[List[int]] = []

class GroupMemberOut(BaseModel):
    id: int
    user_id: int
    full_name: str

    class Config:
        from_attributes = True

class GroupOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    members: List[GroupMemberOut] = []

    class Config:
        from_attributes = True


class GroupMessageCreate(BaseModel):
    group_id: int
    content: str
    sender_user_id: Optional[int] = None
    sender_company_id: Optional[int] = None

class GroupMessageOut(BaseModel):
    id: int
    group_id: int
    content: str
    timestamp: datetime
    sender_user_id: Optional[int]
    sender_company_id: Optional[int]
    sender_name: Optional[str]

    class Config:
        from_attributes = True


class ToolCreate(BaseModel):
    title: str
    description: str
    link: str
    logo_url: str

class ToolOut(ToolCreate):
    id: int
    class Config:
        orm_mode = True

class ToolPermissionOut(BaseModel):
    id: int
    user_id: int
    tool_id: int
    access_start: datetime
    access_end: datetime

    class Config:
        orm_mode = True

class DocumentPermissionCreate(BaseModel):
    user_id: int
    document_id: int
    access_start: datetime
    access_end: datetime

    class Config:
        from_attributes = True


class DocumentPermissionOut(BaseModel):
    id: int
    user_id: int
    document_id: int
    access_start: datetime
    access_end: datetime
    created_at: datetime

    class Config:
        from_attributes = True





class ToolPermissionCreate(BaseModel):
    user_id: int
    tool_id: int
    access_start: datetime
    access_end: datetime

    class Config:
        from_attributes = True


class ToolPermissionOut(BaseModel):
    id: int
    user_id: int
    tool_id: int
    access_start: datetime
    access_end: datetime
    created_at: datetime

    class Config:
        from_attributes = True



class Duration(BaseModel):
    value: int
    unit: Literal["hour", "day", "month", "year"]

class TimedAssignment(BaseModel):
    name: str
    duration: Duration

class EditUserRequest(BaseModel):
    contract_duration: Duration
    tools: List[TimedAssignment]
    projects: List[TimedAssignment]
    documents: List[TimedAssignment]
    groups: List[str]
