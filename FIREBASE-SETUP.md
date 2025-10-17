# 🔥 Firebase Setup Instructions

## Step 1: Download Firebase Admin Service Account Key

1. **Buka Firebase Console**: https://console.firebase.google.com/
2. **Pilih project**: `cartonflow-shyw4`
3. **Go to Project Settings** (gear icon ⚙️)
4. **Tab "Service accounts"**
5. **Click "Generate new private key"**
6. **Download file** dan rename menjadi `firebase-admin-key.json`
7. **Letakkan file** di root folder project (sama level dengan package.json)

## Step 2: Install Firebase Admin SDK

```bash
npm install firebase-admin
```

## Step 3: Jalankan Setup Script

```bash
node setup-firebase.js
```

## Step 4: Upload Firestore Rules

1. **Buka Firebase Console** → **Firestore Database** → **Rules**
2. **Copy content** dari file `firestore.rules` yang dihasilkan
3. **Paste dan Publish** rules

## Step 5: Enable Authentication Methods

1. **Firebase Console** → **Authentication** → **Sign-in method**
2. **Enable Email/Password**: ✅
3. **Save**

## Step 6: Test Authentication

1. **Start development server**: `npm run dev`
2. **Login dengan credentials**:
   - Admin: `admin@bsmcartonbox.com` / `BSMAdmin2025!`
   - Viewer: `viewer@bsmcartonbox.com` / `BSMViewer2025!`

## ⚠️ Important Notes

- **JANGAN commit** `firebase-admin-key.json` ke git
- **Add ke .gitignore**: `firebase-admin-key.json`
- **Simpan credentials** dengan aman untuk production

## 🔧 Troubleshooting

### Error: "Project not found"
- Pastikan project ID di script sesuai dengan Firebase project

### Error: "Permission denied"
- Pastikan service account key sudah di-download dengan benar

### Error: "Email already exists"
- User sudah dibuat sebelumnya, script akan skip otomatis