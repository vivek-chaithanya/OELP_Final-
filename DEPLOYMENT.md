# 🚀 OELP Deployment Guide

## Overview
This guide will help you deploy the OELP platform with the latest fixes for the login authentication issue.

## ✅ What Was Fixed

### Backend (`oelp_backend/apps/api/views.py`)
1. **Enhanced LoginView**: Now returns user roles directly in the login response
2. **Improved MeView**: Better error handling and authentication checks
3. **Added Health Check**: New `/api/health/` endpoint for monitoring

### Frontend 
1. **Login Component**: Stores complete user data including roles in localStorage
2. **App.tsx**: Smart role caching - checks localStorage first before API calls
3. **Environment Configuration**: Proper setup for development and production

### Configuration Files
1. **`.env.production`**: Production environment variables
2. **`vercel.json`**: Frontend Vercel configuration
3. **`settings.py`**: Updated CORS settings for frontend URLs

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.9+
- Vercel CLI: `npm install -g vercel`
- Git

---

## 🔧 Deployment Steps

### **Step 1: Backend Deployment (Already Done)**

Your backend is already deployed at: `https://oelp-backend.vercel.app`

If you need to redeploy the backend:

```bash
cd oelp_backend
vercel --prod
```

### **Step 2: Frontend Deployment**

#### Option A: Using the Deployment Script (Recommended)

```bash
cd frontend
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Manual Deployment

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### **Step 3: Configure Environment Variables on Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**:

```
VITE_API_BASE_URL=https://oelp-backend.vercel.app
VITE_API_URL=https://oelp-backend.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_RbMWNhRcT0lrpd
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click on the latest deployment → **⋯** menu → **Redeploy**

---

## 🧪 Testing the Deployment

### 1. Test Backend Health
```bash
curl https://oelp-backend.vercel.app/api/health/
```

Expected response:
```json
{
  "status": "ok",
  "debug": false,
  "database": "connected"
}
```

### 2. Test Login Flow

1. Open your deployed frontend: `https://frontend-vivek-chaithanyas-projects.vercel.app`
2. Open browser DevTools (F12) → Console
3. Try to login with test credentials
4. You should see logs like:
   ```
   🔧 Using API URL: https://oelp-backend.vercel.app/api
   📡 Login request to: https://oelp-backend.vercel.app/api/auth/login/
   📨 Login response status: 200
   ✅ Login response data: { user: {...}, token: "...", roles: [...] }
   📥 Cached roles in localStorage: ["End-App-User"]
   🎯 Roles from cache: ["End-App-User"]
   ```

### 3. Verify No 404 Errors

- Check the Console - there should be NO 404 errors for `/api/auth/me/`
- The app should load the dashboard immediately after login

---

## 🔍 Troubleshooting

### Issue: "A more recent Production Deployment has been created"

**Solution**: 
- Don't redeploy old deployments
- Always deploy the latest code:
  ```bash
  git pull origin main
  cd frontend
  npm run build
  vercel --prod
  ```

### Issue: Still getting 404 for `/api/auth/me/`

**Solution**:
1. Clear browser cache and localStorage
2. Make sure environment variables are set in Vercel Dashboard
3. Redeploy frontend after setting env vars
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS errors

**Solution**:
1. Check that your frontend URL is added to backend CORS settings
2. Backend `settings.py` should include your frontend URL
3. Redeploy backend if you changed CORS settings

### Issue: Login works but roles not loading

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Check that login response includes `roles` field
3. Check browser console for error messages

---

## 📁 Important Files

### Frontend
- `.env` - Development environment variables
- `.env.production` - Production environment variables
- `vercel.json` - Vercel deployment configuration
- `src/pages/Login.tsx` - Login component with role caching
- `src/App.tsx` - Main app with useRoles hook

### Backend
- `oelp_backend/settings.py` - Django settings with CORS configuration
- `apps/api/views.py` - API views with enhanced LoginView and MeView
- `apps/api/urls.py` - URL routing
- `vercel.json` - Backend Vercel configuration

---

## 🎯 Key Changes Summary

### What happens now when a user logs in:

1. **User enters credentials** → Login request sent
2. **Backend LoginView** → Authenticates user + fetches roles
3. **Response includes**:
   ```json
   {
     "user": {
       "id": 1,
       "username": "user",
       "email": "user@example.com",
       "full_name": "John Doe",
       "roles": ["End-App-User"]  ← Included now!
     },
     "token": "abc123..."
   }
   ```
4. **Frontend Login.tsx** → Stores user + roles in localStorage
5. **App.tsx useRoles()** → Reads from localStorage (no API call!)
6. **Result**: No 404 error, instant role loading ✅

---

## 🔐 Environment Variables Reference

### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://oelp-backend.vercel.app
VITE_API_URL=https://oelp-backend.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_RbMWNhRcT0lrpd
```

### Backend (Vercel Environment Variables)
```bash
DJANGO_SECRET_KEY=<your-secret-key>
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=oelp-backend.vercel.app,.vercel.app
DATABASE_URL=<your-database-url>
RAZORPAY_KEY_ID=rzp_test_RbMWNhRcT0lrpd
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
CORS_ALLOW_ALL=true
```

---

## 📞 Support

If you encounter any issues:

1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify environment variables are set correctly
4. Make sure you're deploying the latest code

---

## ✅ Deployment Checklist

- [ ] Backend deployed and health check passes
- [ ] Frontend environment variables set in Vercel
- [ ] Frontend deployed successfully
- [ ] Test login works without 404 errors
- [ ] Roles load correctly
- [ ] Dashboard loads after login
- [ ] No CORS errors in console

---

🎉 **Your OELP platform is now ready for production!**
