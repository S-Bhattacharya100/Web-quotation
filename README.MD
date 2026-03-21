# 🌐 Webscope - Website Quotation System

A full-stack web application to collect website requirements from clients and generate a downloadable PDF quotation automatically.

---

## 🚀 Features

- 📋 Dynamic quotation form
- ✅ Feature selection (Products, Admin, Security, etc.)
- 💳 Payment gateway options (Razorpay, Stripe, PayPal)
- 🌍 Domain & hosting selection
- 📄 Auto PDF generation using PDFKit
- 🗄️ Data stored in MongoDB
- ⚡ Fast backend using Express.js

---

## 🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- PDF Generator: PDFKit

---

## 📂 Project Structure
project-root/
│
├── backend/
│ ├── server.js
│ └── quotes/
│
├── frontend/
│ └── index.html
│
├── .gitignore
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/S-Bhattacharya100/Web-quotation.git

cd Web-quotation


---

### 2. Install dependencies
npm install


---

### 3. Setup environment variables

Create a `.env` file:

MONGO_URI=your_mongodb_connection_string


---

### 4. Run the server
npm start


---

### 5. Open in browser
http://localhost:3000


---

## 🌐 Deployment

Deployed on Render.

Steps:
- Push code to GitHub
- Connect repo to Render
- Add environment variables
- Deploy 🚀

---

## 📄 Output

- Stores user data in MongoDB
- Generates a downloadable PDF quotation

---

## ⚠️ Notes

- `node_modules/` is ignored
- `backend/quotes/` is temporary storage (auto-generated PDFs)

---

## 👨‍💻 Author

- Swapnamoy Bhattacharya

---

## ⭐ Future Improvements

- Email PDF to client
- Admin dashboard
- Payment integration
- Cloud storage for PDFs - none

---

## 📜 License

This project is open-source and free to use.