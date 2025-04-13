## 🖥️ For Web

```bash
cd brandgenie-pro-web/frontend
npm install
npm run dev
```
**Setup and Run Backend**
```bash
cd brandgenie-pro-web/backend
python -m venv venv
```
```bash
.\venv\Scripts\activate   # On Windows
```
**Or:**
```bash
source venv/bin/activate  # On macOS/Linux
```
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```


## 📱 For Mobile

Install **Expo Go** on your phone and connect it to the **same internet connection or Wi-Fi** as your laptop. Sign up on the Expo Go app.
Then run the following on your laptop and scan the QR code from the terminal:

**IMPORTANT: In the mobile frontend, change all instances of localhost in the frontend to your machine's local IP address (e.g., 192.---.-.--) to connect to the backend.**

```bash
cd brandgenie-pro-mobile/frontend
npm install
npx expo start --tunnel
```
**Setup and Run Backend**
```bash
cd brandgenie-pro-web/backend
python -m venv venv
```
```bash
.\venv\Scripts\activate   # On Windows
```
# Or:
```bash
source venv/bin/activate  # On macOS/Linux
```
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

![Screenshot 2025-04-11 184844](https://github.com/user-attachments/assets/ad529613-3de3-4e93-b7b7-d483b04eaaca)
