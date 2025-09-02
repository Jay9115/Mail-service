# 📧 OTP & Custom Mail Service

A secure and scalable **Node.js + Express + MongoDB Atlas** backend that provides:

- 🔑 **Email OTP service** (e.g., for login/verification flows)  
- ✉️ **Custom mail sending** (clients can send transactional emails from their website)  
- 🛡️ **High security with API Key /**  
- ☁️ **Deployed on Render with MongoDB Atlas**  

This project is built to be **free-tier friendly, fast, and production-ready**.

---

## 🚀 Features

- ✅ Generate and send **OTP via Gmail (App Password based SMTP)**  
- ✅ Verify OTP with **MongoDB TTL auto-expiry (no manual cleanup needed)**  
- ✅ Send **custom emails** with subject & body from client apps  
- ✅ Protect API with **shared secret key**  
- ✅ **Rate limiting** (prevent abuse & brute-force attacks)  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express  
- **Database**: MongoDB Atlas (Free Cluster)  
- **Mailing**: Nodemailer + Gmail App Password  
- **Security**: bcrypt, API Key , Helmet, Rate Limiter  
- **Deployment**: Render 

---

## 📂 Project Structure

```
.
├── server.js            # App entry
├── routes/
│   ├── auth.js          # OTP routes (request & verify)
│   └── mail.js          # Custom mail routes
├── middleware/
│   ├── apiKey.js        # API key auth middleware
│  
├── models/
│   ├── User.js
│   └── Otp.js
├── utils/
│   └── mailer.js        # Nodemailer setup
└── README.md
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jay9115/Mail-service.git
   cd mail-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   PORT=5000
   MONGO_URI=your_mongo_atlas_connection_string

   # Gmail App Password (not your normal Gmail password)
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_gmail_app_password

   # API security
   SHARED_API_KEY=strong_random_key
   HMAC_SHARED_SECRET=another_strong_secret
   ```

4. **Run locally**
   ```bash
   npm start
   ```

   Server runs on `http://localhost:5000`

---

## 🔑 API Endpoints

### Auth (OTP)
- `POST /auth/request-otp` → Request an OTP  
  ```json
  { "email": "user@example.com" }
  ```

- `POST /auth/verify-otp` → Verify OTP  
  ```json
  { "email": "user@example.com", "otp": "123456" }
  ```

### Mail (Custom Emails)
- `POST /mail/send-custom` → Send a custom mail (protected by API Key / HMAC)  
  Headers:
  ```
  x-api-key: <your_shared_key>
  ```
  Body:
  ```json
  { "to": "client@example.com", "subject": "Hello", "message": "This is a custom mail" }
  ```

---

## 🛡️ Security

- All API requests must include a **valid API key** .  
- OTPs are stored in MongoDB with **auto-expiry (5 minutes)**.  
- Passwords & OTPs are **hashed** with bcrypt before saving.  
- Gmail App Passwords are stored securely in **environment variables**.  
- Rate limiting is applied to prevent abuse.  

---

## 🌍 Deployment

- **Backend**: Deploy on [Render](https://render.com).
- **Database**: Use [MongoDB Atlas Free Cluster](https://www.mongodb.com/cloud/atlas).  
- **Frontend (React app)**: Deploy separately on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).  

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.  

---

## 📜 License

MIT License © 2025 [Jay Patel]
