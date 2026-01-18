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

class Vacancy(Base):
    __tablename__ = "vacancies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)       # Заголовок (напр. "Врач-терапевт")
    text = Column(Text)          # Описание
    salary = Column(String)      # Зарплата (напр. "от 150 000 тг")
    date = Column(String)        # Дата публикации

class Appeal(Base):
    __tablename__ = "appeals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)           # Телефон (виден только админу)
    category = Column(String)        # 'thanks', 'complaint', 'proposal'
    text = Column(Text)
    date = Column(String)
    approved = Column(Boolean, default=False) # По умолчанию скрыто

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)       # Отображаемое имя (например "Отчет за 2023")
    file_path = Column(String)   # Путь к файлу (/uploads/docs/file.pdf)
    file_type = Column(String)   # Расширение (pdf, docx, xlsx)
    category = Column(String)    # Ключ страницы (about_income, corp_docs и т.д.)
    date = Column(String)        # Дата загрузки