# 🎓 Student Portal Web Application

A premium Firebase-integrated web application for **SMK Kampung Nangka** that allows students to check their DELIMA login credentials using their IC numbers, with an admin panel for managing student data.

---

## 🌟 Features

### For Students
- **IC-Based Lookup**: Enter your 12-digit IC number to retrieve your DELIMA credentials
- **Easy Copy**: One-click copy to clipboard for email and password
- **Premium UI**: Modern, responsive design with smooth animations
- **Mobile-Friendly**: Works seamlessly on all devices

### For Administrators
- **Secure Login**: Admin authentication (default: admin/12345678)
- **Excel Upload**: Upload student data directly from Excel files
- **Batch Processing**: Efficient Firebase upload with progress tracking
- **Session Management**: Auto-logout with secure session handling

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge recommended)
- Internet connection (for Firebase access)
- The Excel file: `ID DELIMA SMK KAMPUNG NANGKA.xlsx`

### Initial Setup - Upload Student Data

**IMPORTANT:** Before students can use the portal, you must upload the initial student data to Firebase.

#### Option 1: Using the Upload Tool (Recommended)

1. Open `upload-data.html` in your web browser:
   ```
   File → Open → d:\AI PROJECT\Student_delima v1\upload-data.html
   ```

2. Click **"Choose Excel File"**

3. Select the file: **ID DELIMA SMK KAMPUNG NANGKA.xlsx**

4. Review the preview showing the first 5 records

5. Click **"Upload to Firebase"**

6. Wait for the upload to complete (you'll see progress updates)

7. Success! 37 student records should now be in Firebase

#### Option 2: Using Admin Panel

1. Open `admin.html` in your browser

2. Login with:
   - **User ID**: `admin`
   - **Password**: `12345678`

3. Click **"Choose Excel File"** and select the Excel file

4. Click **"Upload to Firebase"**

---

## 📖 Usage Guide

### For Students

1. Open `index.html` in your web browser

2. Enter your 12-digit IC number (without dashes)
   - Example: `001234567890`

3. Click **"Search My Credentials"**

4. Your DELIMA credentials will be displayed:
   - DELIMA ID
   - Email Address
   - Password

5. Use the **"Copy"** buttons to copy credentials to clipboard

### For Administrators

1. Open `admin.html` in your browser

2. Login with admin credentials:
   - **User ID**: `admin`
   - **Password**: `12345678`

3. Upload new student data:
   - Click **"Choose Excel File"**
   - Select an Excel file with student data
   - Click **"Upload to Firebase"**
   - Wait for upload confirmation

4. Click **"Logout"** when finished

---

## 📁 Project Structure

```
Student_delima v1/
│
├── index.html              # Student portal main page
├── student-portal.js       # Student search functionality
│
├── admin.html              # Admin dashboard
├── admin.js                # Admin authentication & upload logic
│
├── upload-data.html        # Initial data upload tool
│
├── firebase-config.js      # Firebase configuration
├── styles.css              # Premium CSS design system
│
├── ID DELIMA SMK KAMPUNG NANGKA.xlsx  # Student data (37 records)
│
└── README.md               # This file
```

---

## 🔐 Security Notes

### Firebase Configuration
- The Firebase API keys are public (this is normal for client-side apps)
- Security is enforced through Firebase Firestore security rules
- **Configure security rules in Firebase Console**

### Password Storage
- Passwords are stored in plain text (as required for student viewing)
- Students can see their own passwords
- **Do NOT store sensitive passwords in this system**

### Admin Credentials
- Default admin login is hardcoded for simplicity
- For production use, consider implementing proper authentication
- Change default credentials or implement Firebase Authentication

---

## 🛠️ Firebase Setup

### Firestore Database Structure

**Collection**: `students`

**Document Structure**:
```javascript
{
  ic: "001234567890",           // IC number (Document ID)
  delimaId: "SK1234A",          // DELIMA ID
  email: "student@example.com", // Student email
  password: "password123"       // Student password
}
```

### Recommended Security Rules

In Firebase Console → Firestore Database → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection - read only from client
    match /students/{document=**} {
      allow read: if true;  // Anyone can read
      allow write: if false; // Prevent client-side writes
    }
  }
}
```

**Note**: For uploads to work, temporarily set write permissions or use Firebase Admin SDK.

---

## 📊 Excel File Format

Your Excel file should have the following structure:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| IC Number | DELIMA ID | Email | Password |
| 001234567890 | SK1234A | student@edu.my | pass123 |
| 001234567891 | SK1234B | student2@edu.my | pass456 |

**Requirements**:
- Row 1: Headers (will be skipped)
- Column A: IC number (12 digits, no dashes)
- Column B: DELIMA ID
- Column C: Email address
- Column D: Password

---

## 🎨 Design Features

### Premium UI Elements
- **Glassmorphism**: Frosted glass effect on cards
- **Gradients**: Vibrant purple-blue color scheme
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clean Inter font family
- **Responsive**: Auto-adapts to mobile, tablet, and desktop

### Color Scheme
- Primary: Purple gradient (#667eea → #764ba2)
- Secondary: Pink gradient (#f093fb → #f5576c)
- Success: Blue gradient (#4facfe → #00f2fe)
- Background: Dark theme (#0f0f23)

---

## 🔧 Troubleshooting

### Student Record Not Found
- **Check IC format**: Must be exactly 12 digits
- **Verify data upload**: Ensure initial data has been uploaded to Firebase
- **Check Firebase Console**: Navigate to Firestore and verify the `students` collection exists

### Upload Fails
- **Check internet connection**: Firebase requires active connection
- **Verify Firebase config**: Ensure firebaseConfig in `firebase-config.js` is correct
- **Check file format**: Excel file must be .xlsx or .xls
- **Review console**: Open browser DevTools (F12) to see error messages

### Admin Login Not Working
- **Verify credentials**: 
  - User ID: `admin` (lowercase)
  - Password: `12345678` (exactly 8 digits)
- **Clear cache**: Try clearing browser cache and localStorage

---

## 📱 Browser Compatibility

✅ **Supported Browsers**:
- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

⚠️ **Note**: Internet Explorer is not supported.

---

## 🚦 Quick Start Checklist

- [ ] Open `upload-data.html`
- [ ] Upload `ID DELIMA SMK KAMPUNG NANGKA.xlsx`
- [ ] Verify 37 records uploaded successfully
- [ ] Test student lookup with a sample IC number
- [ ] Test admin login
- [ ] Test admin Excel upload with a sample file
- [ ] Configure Firebase security rules
- [ ] Share student portal URL with students

---

## 📞 Support

For technical support or questions:
- Check Firebase Console for database issues
- Review browser console (F12) for error messages
- Verify Excel file format matches requirements

---

## 📝 Version History

**Version 1.0** (February 2026)
- Initial release
- Student IC lookup portal
- Admin panel with Excel upload
- Firebase Firestore integration
- Premium responsive UI

---

## 📄 License

This application is created for **SMK Kampung Nangka** internal use.

---

**Built with ❤️ for SMK Kampung Nangka Students**
