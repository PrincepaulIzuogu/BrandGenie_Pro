import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
FROM_EMAIL = os.getenv('FROM_EMAIL')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
FROM_NAME = os.getenv('FROM_NAME')
PORT = int(os.getenv('PORT', 5000))
