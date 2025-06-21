# Feleg Web Application - Testing Checklist

## 🌐 1. Basic Site Health
- [ ] Homepage loads without white screen or crash
- [ ] Navigation links work correctly
- [ ] No red errors in DevTools Console
- [ ] Favicon and title are correct
- [ ] Deployed version reflects latest code

## 🔐 2. Authentication
- [ ] Can create new parent account with proper redirection
- [ ] Can create provider account
- [ ] Login form works and redirects based on role
- [ ] Session persists on page reload
- [ ] Logout works and redirects to login

## 🧭 3. Routing + Role Protection
- [ ] /dashboard/parent not accessible to non-logged-in users
- [ ] /dashboard/provider not accessible to unauthenticated users
- [ ] Landing page links go to correct pages
- [ ] Invalid routes show friendly 404 or redirect

## 📋 4. Parent Dashboard
- [ ] Programs list loads (not empty forever or broken layout)
- [ ] Cards are styled correctly and responsive
- [ ] Clicking "View Details" goes to /programs/[id] with correct data
- [ ] Apply form on /apply/[id] loads with form inputs
- [ ] Application submits and shows toast confirmation
- [ ] Application Tracker shows submitted apps

## 🧑‍🏫 5. Provider Dashboard
- [ ] Provider dashboard loads correctly after login
- [ ] Tab interface works (My Programs, Post Program, Applications)
- [ ] Post Program form shows and validates required fields
- [ ] Submitted programs show up under "My Programs"
- [ ] Deleting a program works (if implemented)
- [ ] Applications tab loads (if connected to DB)

## 📁 6. Media / Uploads
- [ ] File input works for document/image upload
- [ ] Files upload to Supabase and return public URL
- [ ] Uploaded files can be previewed or downloaded
- [ ] Form still submits even without a file (if optional)

## 📱 7. Responsive Design
- [ ] Mobile (iPhone 13, Galaxy) - navbar/footer stack correctly
- [ ] Tablet - cards/grid don't overflow
- [ ] Desktop (Chrome + Safari) - buttons/inputs are tap-friendly
- [ ] No layout shifts on transition

## 🎨 8. UI/UX Polish
- [ ] Page transitions run smoothly (fade + slide)
- [ ] Buttons have hover effects
- [ ] Badges/status tags show correctly
- [ ] Success and error toasts display as expected
- [ ] Empty states show friendly messages

## 🧪 9. Testing Edge Cases
- [ ] Submitting empty form shows errors
- [ ] Visiting /dashboard/parent while logged out
- [ ] Wrong credentials show error message
- [ ] Fast clicking around - app stays stable
- [ ] Slow loading handled gracefully

## 🛠 10. Backend/Storage
- [ ] Supabase DB is live (no 401/403 in network tab)
- [ ] Storage bucket exists for uploads
- [ ] RLS policies are applied but not overly strict
- [ ] programs and applications tables are queryable
- [ ] No hardcoded or test data leaking in prod

## Status
- [ ] **Ready for Production**
- [ ] **Needs Minor Fixes**
- [ ] **Needs Major Work**
- [ ] **Not Ready**

**Notes:** 