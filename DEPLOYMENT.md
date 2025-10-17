# 🚀 Production Deployment Guide

## Quick Start - Deploy ke Vercel

### 1. **Setup Vercel Account**
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub account
3. Connect repository `mrizkymxx/bmscartonbox`

### 2. **Environment Variables Setup**
Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

```bash
# Firebase Public Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAFUf5AUsT8fvqHYvA_vDVVjBRuVXWsxwA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cartonflow-shyw4.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cartonflow-shyw4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cartonflow-shyw4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142328250405
NEXT_PUBLIC_FIREBASE_APP_ID=1:142328250405:web:1939db7116e40b4cbfbfcc

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cartonflow-shyw4.iam.gserviceaccount.com

# Firebase Admin Private Key (⚠️ IMPORTANT: Copy exactly dengan quotes dan escape characters)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcluJX8ZnqBJSB\ngXG95zyOgq7tPvSRYm6hV3up+yCW01qqdZ717aIdflNoDopkbrz7ahv9YO4HpDE2\njRUeIxtqP96ZFZns8GyE6YLzjd5FusKcEfRt1c+xtNOcBkcVbmMSWh1iAcJbIu1i\n87Gt2DY709VEVlJzXyyHuTSXuK6MUtvIb8jsg/eEAqnM9cu5S/ymnxLqEXdPpdo4\nVVNhUDndid1Rcn6lW1V+DG2zmIPKmvj6FBfrkIPtnTMg/BwS01QLDp6q6eGqSwCK\nTZwyFNJePCU9NzwpipVlUv9MLEPiGKvAxj+dqhqZ38GD9YSRMv0bMJCU9kj7WTxQ\nurKNmnIDAgMBAAECggEAaE6KofYzBwb6aBCbBabJqkOeTr31rKeEU5OH/NUsUFWJ\nqk/rBjRDc7nP28UAaMQ6ZZIDwTjr5T4dLUPiJ/mG1aN08SNXQURgtCqtCtjbMVLC\nAkW1NJilWMz+QOlxBG/JthxZh4X4btrhsGg2bNNvtbORxXoiC78F0fngJhwkoWIN\nvSV+JHP02AjjuxYv7RG8sxnp1EgwNxgRYZWRBp9O3KIdcQCDwdAxX9NFBjlyVW5y\nB/5GGPXDsLTkxebv5RhOsb2syvzGQgZGeEDmnI81vSNh/omgZSnHZDw1aMOTiKUI\nfDWN3zSmma860hzCWi9KwZMehxH7ua6gqj4S4EdzQQKBgQD8E66Iax9KYn1SXB1q\nfS3f2P8XdYXF+InFgw9eiU4LM1/igCNeVfCU6kbfe7y09ZNTsaEwlha/E0GB4eB1\nGBy4ljv7Tsda44MDaZvsRJwi++HAMIrqtfMTYPE62q6KzqB3bCs+KOqAqebGHqIX\neG0gIKDuazDScZpCi9UHGsbwwwKBgQDgBcAwJS9IrL9dGYU0iY25CcJKSXxcUCGM\nvtTeUajLtmLYz5EAFParR9QSNMgdEmB5mZ4YRgAE5UH33K+1kVk1IfzzMhc1Agxp\n3ozpNXIXKI0EJWe3ZX01fyMyybvXmR4LVoz0CtotmPh4RK/CE6RHdl4d81xvpas+\n8DtOErZlwQKBgCwKXEHlRVA/qNmM0m7ac/tZ9CdrFvYhmCBz52mC36nBTg1KieNf\nbGr4C23cNnn/NcA3lovgjRTRDm7cwdRzZAEz7kLX3qiYezlLaDx9ODI8g5KKaJrd\nMxy9oSfBMSF7PDnhIiT4DRBxnqoajANBvP8R9EvzWlJKGsNpnsxg90T1AoGAU8xy\n5s+SD2pnLukz9cIanIP1BJrWhSWIV0CvGfaL4J/5+8YxJEmzN8DnqGPME2vjYLlA\n9S2CJlKnyZLou0+CgiiTmVk8axy4DgYsybOvWNBXZ5yiXmz9WDyVqxLhTDW/klgu\n478HfBUDpOF0qXF1ezHg5O06v5zGIQX1+S9wwUECgYEAk76AO8cXr1oA3YLR8RRI\nahgPPx7aqKPwHOeRzpHxcoGgH5z0hwLmIAdst6+tW/54cvGXReIPlhuKpNZbyfOC\nzwq9+5r4ECZSDowygDgXWJfJ4qm5xZuAiOZsSdRzcoylJQbJZ9ASFNitzAsCFoNt\nYJRpMDjOSNpsvDwpBDUkboI=\n-----END PRIVATE KEY-----\n"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_c4uRqdxfNys2kwiQ_RfguC2n9llydpaAaFEn0FJkcl1osEb
```

### 3. **Deploy Steps**

#### Via Vercel Dashboard (Easiest):
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import dari GitHub: `mrizkymxx/bmscartonbox`
4. Add environment variables di atas
5. Click "Deploy"

#### Via CLI (Alternative):
```bash
npx vercel
# Follow prompts
# Add environment variables when asked
```

### 4. **Post-Deployment Checklist**

✅ **Test Authentication**:
- Login dengan: `admin@bsmcartonbox.com` / password admin
- Login dengan: `viewer@bsmcartonbox.com` / password viewer

✅ **Test Core Features**:
- Dashboard loads dengan customer stats
- Production tracking berfungsi
- Delivery management works
- Purchase orders dapat dibuat/edit

✅ **Verify Permissions**:
- Admin dapat CRUD semua data
- Viewer hanya dapat view data

---

## Alternative: Deploy ke Netlify

### 1. **Setup Netlify**
1. Buka [netlify.com](https://netlify.com)
2. Connect dengan GitHub
3. Choose repository `mrizkymxx/bmscartonbox`

### 2. **Build Settings**
```bash
Build command: npm run build
Publish directory: .next
```

### 3. **Environment Variables**
Same environment variables as Vercel (di atas)

---

## Firebase Configuration (Already Done ✅)

Firebase sudah configured dengan:
- ✅ Authentication enabled
- ✅ Firestore security rules deployed  
- ✅ Admin users created
- ✅ Database collections ready

---

## 🚨 **SECURITY NOTES**

1. **Environment Variables**: Jangan pernah commit `.env.local` ke Git
2. **Private Key**: Copy private key EXACTLY dengan semua `\n` characters
3. **Firebase Admin**: Hanya untuk server-side operations
4. **Access Control**: Users harus login untuk akses aplikasi

---

## 🎯 **Expected Production URL**

Setelah deploy, Anda akan mendapat URL seperti:
- Vercel: `https://bmscartonbox-xyz.vercel.app`
- Netlify: `https://bmscartonbox-xyz.netlify.app`

Login credentials untuk testing:
- **Admin**: `admin@bsmcartonbox.com`
- **Viewer**: `viewer@bsmcartonbox.com`

---

## 📞 **Support**

Jika ada issues saat deployment:
1. Check environment variables spelling
2. Verify Firebase project is active
3. Check build logs di Vercel/Netlify dashboard
4. Test locally first: `npm run build && npm start`