import smtplib
from email.mime.text import MIMEText
from app.config import FROM_EMAIL, EMAIL_PASSWORD, FROM_NAME

def send_verification_email(to_email: str, code: str):
    subject = "Your BrandGenie Pro Verification Code"
    body = f"Your verification code is: {code}"

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = FROM_NAME
    msg['To'] = to_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(FROM_EMAIL, EMAIL_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        print(f"Verification email sent to {to_email}")
    except Exception as e:
        print(f"Error sending email: {e}")
