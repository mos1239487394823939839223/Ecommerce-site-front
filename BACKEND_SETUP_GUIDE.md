# 🔧 Backend Setup Guide for Vercel

## ⚠️ Current Issue: MongoDB Connection Timeout

**Error:** `Operation products.find() buffering timed out after 10000ms`

**Cause:** Your backend on Vercel cannot connect to MongoDB database.

---

## 🎯 Step-by-Step Fix

### Step 1: Configure MongoDB Atlas

#### 1.1 Whitelist All IP Addresses (For Vercel)

Since Vercel uses dynamic IPs, you need to allow all IP addresses:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click your cluster
3. Go to **Network Access** (left sidebar)
4. Click **"+ ADD IP ADDRESS"**
5. Click **"ALLOW ACCESS FROM ANYWHERE"**
6. This adds `0.0.0.0/0` to whitelist
7. Click **"Confirm"**

**⚠️ Important:** This is required for Vercel deployments!

#### 1.2 Get Your MongoDB Connection String

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** driver
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
   ```
5. Replace `<username>`, `<password>`, and `<database>` with your actual values

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

### Step 2: Configure Environment Variables on Vercel

Your backend needs environment variables to connect to MongoDB.

#### 2.1 Go to Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your backend project: `ecommerce-site-backend-oriu`
3. Click on it
4. Go to **"Settings"** tab
5. Click **"Environment Variables"** in left sidebar

#### 2.2 Add Required Environment Variables

Add these environment variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `MONGODB_URI` or `DATABASE_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/db` | Your MongoDB connection string from Step 1.2 |
| `NODE_ENV` | `production` | Production environment |
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-chars` | Secret for JWT tokens (any random string, 32+ chars) |
| `PORT` | `8000` | Backend port (optional on Vercel) |

**⚠️ Important Notes:**
- Use the exact variable name your backend code expects (check your backend `.env` file or config)
- Most Node.js/Express apps use `MONGODB_URI` or `DATABASE_URL` or `MONGO_URI`
- Generate a strong JWT_SECRET: `openssl rand -base64 32` (run in terminal)

#### 2.3 Example Environment Variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://ecommerce_user:MyP@ssw0rd123@cluster0.mongodb.net/ecommerce_db?retryWrites=true&w=majority

# JWT Secret (generate your own!)
JWT_SECRET=8f3a5c9d2e7b1f4a6c8e0d3b5a7f2e9c1d4b6a8f3e5c7d9b2a4f6e8c0d3b5a7f

# Environment
NODE_ENV=production

# API Settings (optional)
PORT=8000
API_VERSION=v1
```

---

### Step 3: Check Your Backend Code

Your backend needs to properly read the environment variable:

#### 3.1 Common MongoDB Connection Code

**Express/Node.js:**
```javascript
const mongoose = require('mongoose');

// Read from environment variable
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));
```

**Make sure your backend code reads the correct environment variable name!**

---

### Step 4: Redeploy Backend

After adding environment variables:

#### Option A: Redeploy from Vercel Dashboard
1. Go to **"Deployments"** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

#### Option B: Redeploy from GitHub
1. Make a small change to your backend code (add a comment)
2. Commit and push to GitHub
3. Vercel will auto-deploy

---

### Step 5: Verify Backend is Working

#### 5.1 Test Products Endpoint

Open your browser or use curl:

```bash
curl https://ecommerce-site-backend-blue.vercel.app/api/v1/products
```

**Expected:** JSON response with products array
```json
{
  "data": [...]
}
```

**If Still Error:** Check Step 6

#### 5.2 Test Health/Status Endpoint (if available)

```bash
curl https://ecommerce-site-backend-blue.vercel.app/api/v1/health
# or
curl https://ecommerce-site-backend-blue.vercel.app/
```

---

### Step 6: Check Backend Logs on Vercel

If still having issues:

1. Go to your backend project on Vercel
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"Functions"** or **"Logs"** tab
5. Look for error messages:
   - ❌ `MongooseError: buffering timed out` → MongoDB not connected
   - ❌ `MONGODB_URI is not defined` → Environment variable missing
   - ❌ `Authentication failed` → Wrong MongoDB credentials
   - ❌ `Network error` → IP not whitelisted

---

## 🔍 Troubleshooting Common Issues

### Issue 1: "Buffering timed out"
**Cause:** MongoDB cannot be reached
**Solutions:**
- ✅ Check IP whitelist (Step 1.1) - should be `0.0.0.0/0`
- ✅ Verify connection string is correct
- ✅ Check MongoDB cluster is not paused (Atlas free tier auto-pauses after inactivity)
- ✅ Verify environment variable is set on Vercel
- ✅ Redeploy after setting environment variables

### Issue 2: "Authentication failed"
**Cause:** Wrong MongoDB username/password
**Solutions:**
- ✅ Create new database user in MongoDB Atlas
- ✅ Use correct password (special characters need URL encoding)
- ✅ Update connection string with correct credentials

### Issue 3: "Cannot read property 'find' of undefined"
**Cause:** Mongoose model not properly initialized
**Solutions:**
- ✅ Check model exports
- ✅ Ensure MongoDB connection happens before route registration
- ✅ Check for typos in model names

### Issue 4: "CORS Error"
**Cause:** Backend not allowing frontend domain
**Solutions:**
- ✅ Add CORS middleware to backend
- ✅ Allow your frontend domain

---

## 🔐 Backend CORS Configuration

Your backend must allow requests from your frontend.

### Express.js CORS Setup

```javascript
const cors = require('cors');

// Allow all origins (development)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// OR allow specific origins (production)
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://your-frontend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### Vercel CORS Headers (Alternative)

Add to your backend's `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

---

## 📊 Backend Endpoints Required

Make sure your backend has these endpoints:

### Authentication
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/forgotPassword` - Forgot password
- `POST /api/v1/auth/verifyResetCode` - Verify reset code
- `PUT /api/v1/auth/resetPassword` - Reset password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get single category
- `POST /api/v1/categories` - Create category (admin)
- `PUT /api/v1/categories/:id` - Update category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)

### Brands
- `GET /api/v1/brands` - Get all brands
- `GET /api/v1/brands/:id` - Get single brand
- `POST /api/v1/brands` - Create brand (admin)
- `PUT /api/v1/brands/:id` - Update brand (admin)
- `DELETE /api/v1/brands/:id` - Delete brand (admin)

### Subcategories
- `GET /api/v1/subcategories` - Get all subcategories
- `GET /api/v1/subcategories/:id` - Get single subcategory
- `POST /api/v1/subcategories` - Create subcategory (admin)
- `PUT /api/v1/subcategories/:id` - Update subcategory (admin)
- `DELETE /api/v1/subcategories/:id` - Delete subcategory (admin)

### Banners
- `GET /api/v1/banners` - Get all banners (for home slider)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/:productId` - Update cart item
- `DELETE /api/v1/cart/:productId` - Remove from cart

### Orders
- `GET /api/v1/orders` - Get all orders (admin)
- `GET /api/v1/orders/user/:userId` - Get user orders
- `POST /api/v1/orders/:cartId` - Create order

### Users (Admin)
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get single user (admin)
- `PUT /api/v1/users/:id` - Update user (admin)
- `PUT /api/v1/users/:id/toggle-active` - Toggle user active status (admin)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics (admin)

---

## ✅ Backend Ready Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] IP address `0.0.0.0/0` is whitelisted
- [ ] MongoDB connection string is correct
- [ ] `MONGODB_URI` environment variable is set on Vercel
- [ ] `JWT_SECRET` environment variable is set on Vercel
- [ ] Backend is redeployed after setting env vars
- [ ] CORS is properly configured
- [ ] All required endpoints exist
- [ ] Test endpoint returns data: `curl https://ecommerce-site-backend-blue.vercel.app/api/v1/products`

---

## 🚀 Quick Test After Setup

```bash
# Test 1: Get products
curl https://ecommerce-site-backend-blue.vercel.app/api/v1/products

# Test 2: Get categories
curl https://ecommerce-site-backend-blue.vercel.app/api/v1/categories

# Test 3: Get brands
curl https://ecommerce-site-backend-blue.vercel.app/api/v1/brands

# Test 4: Test authentication
curl -X POST https://ecommerce-site-backend-blue.vercel.app/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

If all tests return proper JSON (not timeout errors), your backend is ready! ✅

---

## 🎯 Next Steps After Backend is Fixed

1. **Test Frontend Locally:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3001 and check if products load

2. **Deploy Frontend:**
   Your frontend will auto-deploy from GitHub (already set up)
   
3. **Test Live Site:**
   - Products should load
   - Login should work
   - Admin dashboard should work

---

## 📞 Still Having Issues?

### Check Backend Logs
1. Vercel Dashboard → Your Backend Project
2. Deployments → Latest Deployment
3. Click on deployment → View Logs
4. Look for MongoDB connection errors

### Common Log Messages

**✅ Success:**
```
✅ MongoDB connected
Server running on port 8000
```

**❌ Errors:**
```
MongooseError: Operation buffering timed out
→ Fix: Whitelist IP 0.0.0.0/0 in MongoDB Atlas

MongoServerError: Authentication failed
→ Fix: Check username/password in connection string

Error: MONGODB_URI is not defined
→ Fix: Add environment variable on Vercel
```

---

## 🔑 Environment Variable Names Reference

Different backends use different variable names. Check your backend code for which one it uses:

Common MongoDB variable names:
- `MONGODB_URI`
- `MONGO_URI`
- `DATABASE_URL`
- `DB_CONNECTION`
- `MONGODB_CONNECTION_STRING`

Common JWT variable names:
- `JWT_SECRET`
- `JWT_KEY`
- `SECRET_KEY`
- `TOKEN_SECRET`

**Look in your backend code** for `process.env.MONGODB_URI` (or similar) to find the exact name!

---

Your backend is almost ready! Just follow these steps and it should work perfectly! 🚀

