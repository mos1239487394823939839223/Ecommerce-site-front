# 🛒 E-Commerce Site - Frontend

## ✅ Production Ready!

This Next.js e-commerce frontend is connected to your production backend on Vercel.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## 🔗 Backend Connection

**Production Backend:** `https://ecommerce-site-backend-oriu.vercel.app/api/v1`

All API calls automatically go to your production backend. No configuration needed!

---

## 🔐 Login Credentials

### Backend Authentication Only
- Use your backend user credentials
- Register new users at `/register`
- Admin users must be created in your backend database

---

## 📁 Key Files

- `src/services/clientApi.ts` - Public API calls (products, categories, auth)
- `src/services/adminApi.ts` - Admin API calls (CRUD operations)
- `src/app/admin/` - Admin dashboard pages
- `PRODUCTION_SETUP.md` - Detailed production configuration guide

---

## 🎯 Features

### User Features
- ✅ Product browsing with search & filters
- ✅ Shopping cart
- ✅ Wishlist
- ✅ User authentication
- ✅ Order placement
- ✅ Payment integration

### Admin Features
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Brand management
- ✅ Order management
- ✅ User management

---

## 🐛 Debugging

All admin forms now include console logging:

1. **Open Browser Console** (F12)
2. Perform action (update product/category/brand)
3. Check logs:
   ```
   Submitting product data: {...}
   Updating product: product_id
   Update response: {...}
   ```

4. **Check Network Tab** to see actual API calls

---

## 📚 Documentation

- `PRODUCTION_SETUP.md` - Production backend configuration
- `env.template` - Environment variable template (optional)

---

## 🧪 Testing

### Test Backend Connection
```bash
curl https://ecommerce-site-backend-oriu.vercel.app/api/v1/products
```

### Test in Browser
1. Start app: `npm run dev`
2. Open: `http://localhost:3001`
3. Check products load
4. Try logging in
5. Test admin operations

---

## 🔧 Configuration

### Default Backend (Production)
```
https://ecommerce-site-backend-oriu.vercel.app/api/v1
```

### Override (Optional)
Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

No environment variables needed - backend URL is already configured!

---

## ⚠️ Important Notes

1. **CORS:** Your backend must allow requests from frontend domain
2. **Authentication:** JWT tokens are stored in localStorage
3. **Local Admin:** Works offline for development
4. **Console Logs:** Check browser console for detailed error messages

---

## 📞 Troubleshooting

### Products not loading?
- Check: `https://ecommerce-site-backend-oriu.vercel.app/api/v1/products`
- Verify backend is running
- Check browser console for CORS errors

### Update not working?
- Open browser console (F12)
- Look for error messages
- Check Network tab for failed requests
- Verify you're logged in as admin

### Authentication fails?
- Check backend signin endpoint works: `POST /api/v1/auth/signin`
- Verify token is saved: `localStorage.getItem('token')`
- Check backend user credentials are correct
- Ensure user exists in backend database

---

## 🎉 You're Ready!

Your e-commerce site is connected to production backend and ready to use!

**Next Steps:**
1. Test all features locally
2. Deploy frontend to Vercel/Netlify
3. Configure CORS on backend
4. Monitor backend logs for errors
5. Start selling! 🚀
