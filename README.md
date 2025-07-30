# 🛠️ Complaint Management Web Application

A full-stack complaint management system built with **Next.js**, **MongoDB**, and **NodeMailer**, designed to streamline user complaints and allow administrators to efficiently manage and resolve issues.

---

## 🚀 Features

- ✍️ Users can **submit complaints** with title, description, category, and priority.
- 📬 Automatic **email notifications** sent to both user and admin on:
  - Complaint submission
  - Complaint status update
- 📂 Admins can **view**, **update**, and **delete** complaints.
- 🔐 User authentication (extendable).

---

### 📁 Folder Structure

| Path                            | File             | Description                                           |
|---------------------------------|------------------|-------------------------------------------------------|
| `/api/admin/complaint/[id]/`    | `route.js`       | `PUT/DELETE` – Update or delete a complaint           |
| `/api/admin/`                   | `route.js`       | `GET` – Fetch all complaints for admin                |
| `/api/complaints/`              | `route.js`       | `POST` – Submit a new complaint (user)                |
| `/api/login/`                   | `route.js`       | `POST` – User login endpoint                          |
| `/api/signup/`                  | `route.js`       | `POST` – User registration endpoint                   |
| `/components/`                  | `ComplaintForm.jsx` | Complaint form UI component                       |
| `/login/`                       | `page.jsx`       | Login page UI                                         |
| `/signup/`                      | `page.jsx`       | Signup page UI                                        |
| `/models/`                      | `complaints.js`  | Mongoose schema for complaints                        |
| `/models/`                      | `user.js`        | Mongoose schema for users                             |
| `/utils/`                       | `connect.js`     | MongoDB connection utility                            |
| `/utils/`                       | `mailer.js`      | NodeMailer utility for sending emails                 |


## 📸 Screenshots


### 📝 Complaint Submission Form
![Complaint Form](<img width="875" height="437" alt="Screenshot 2025-07-31 030103" src="https://github.com/user-attachments/assets/5df24ed7-c043-4d81-b2e7-3558d8eb5a48" />)

### 📊 Admin Complaint Dashboard
![Admin Dashboard](<img width="944" height="441" alt="Screenshot 2025-07-31 030231" src="https://github.com/user-attachments/assets/f2b46048-8f53-4efd-895a-d9b167efa7ec" />)

---

## 🧰 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: API Routes (Next.js server functions)
- **Database**: MongoDB Atlas + Mongoose
- **Email Service**: NodeMailer (SMTP)

## 🔧 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gauravvxv/Prime-Vacations.git
cd Prime-Vacations.git
```

### 2. install Dependencies
```
npm install
```
### 3. Create .env.local File
```
touch .env.local

MONGO_URL = MongoDB URL
JWT_SECRET = secret
ADMIN_EMAIL = example@gmail.com
EMAIL_PASS = PassKeys
```

### 4. Run the App Locally
```
npm run dev
```

📬 Email Functionality
- Emails are handled using NodeMailer. Here's how it works:
- On complaint submission, two emails are triggered:
✅ User: confirmation of submission
✅ Admin: notification of new complaint

- On complaint status update, two emails are triggered:
✅ User: informed of new status (e.g., "Resolved")
✅ Admin: notified of update

```
utils/mailer.js
```

### API Overviews

POST ```/api/login```
Login User and Admin

POST ```api/complaints```
Post complaints

GET ``` api/admin/complaint ```
Get all the Complaints to Admin

PUT ``` api/admin/complaint/[id]```
Update complaint status (admin)

DELETE ``` api/admin/complaint/[id]```
Delete complaint (admin)

