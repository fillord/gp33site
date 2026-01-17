from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    text = Column(Text)
    textKz = Column(Text, nullable=True)
    date = Column(String)
    approved = Column(Boolean, default=False)

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    titleKz = Column(String)
    text = Column(Text)
    textKz = Column(Text)
    date = Column(String)
    image = Column(String, nullable=True)

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    titleKz = Column(String)
    url = Column(String)

class Schedule(Base):
    __tablename__ = "schedule"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    cabinet = Column(String)
    dept = Column(String, nullable=True)
    mon = Column(String)
    tue = Column(String)
    wed = Column(String)
    thu = Column(String)
    fri = Column(String)