# Feleg Web Application - Setup Guide

## 🚀 Quick Setup

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Project Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Note down your project URL and anon key

2. **Set up Database Tables**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase_applications_table.sql`

3. **Configure RLS Policies**:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

   -- Profiles policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Programs policies
   CREATE POLICY "Anyone can view programs" ON programs
     FOR SELECT USING (true);

   CREATE POLICY "Providers can insert programs" ON programs
     FOR INSERT WITH CHECK (auth.uid() = provider_id);

   CREATE POLICY "Providers can update own programs" ON programs
     FOR UPDATE USING (auth.uid() = provider_id);

   CREATE POLICY "Providers can delete own programs" ON programs
     FOR DELETE USING (auth.uid() = provider_id);

   -- Applications policies
   CREATE POLICY "Parents can view own applications" ON applications
     FOR SELECT USING (auth.uid() = parent_id);

   CREATE POLICY "Parents can insert applications" ON applications
     FOR INSERT WITH CHECK (auth.uid() = parent_id);

   CREATE POLICY "Providers can view applications for their programs" ON applications
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM programs 
         WHERE programs.id = applications.program_id 
         AND programs.provider_id = auth.uid()
       )
     );

   CREATE POLICY "Providers can update applications for their programs" ON applications
     FOR UPDATE USING (
       EXISTS (
         SELECT 1 FROM programs 
         WHERE programs.id = applications.program_id 
         AND programs.provider_id = auth.uid()
       )
     );
   ```

4. **Create Storage Bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `documents`
   - Set it to public or private based on your needs

### 3. Test the Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Go to `/signup` and create a test account
   - Try logging in at `/login`
   - Verify you're redirected to the correct dashboard

3. **Test Program Management**:
   - Login as a provider
   - Try creating a new program
   - Verify it appears in "My Programs"

4. **Test Applications**:
   - Login as a parent
   - Browse programs and apply to one
   - Verify the application appears in the tracker

### 4. Common Issues & Solutions

#### Issue: "Supabase client not initialized"
**Solution**: Check that your environment variables are correctly set and restart the dev server.

#### Issue: "Row Level Security policy violation"
**Solution**: Make sure you've run the RLS policies SQL above.

#### Issue: "Table does not exist"
**Solution**: Run the database schema from `supabase_applications_table.sql`.

#### Issue: "Authentication failed"
**Solution**: Check that your Supabase URL and anon key are correct.

### 5. Production Deployment

1. **Set up production environment variables** on your hosting platform
2. **Update RLS policies** if needed for production
3. **Test all functionality** in production environment
4. **Monitor for errors** and adjust as needed

### 6. Security Checklist

- [ ] RLS policies are enabled on all tables
- [ ] Environment variables are not committed to git
- [ ] Storage bucket permissions are appropriate
- [ ] Authentication flow is working correctly
- [ ] No sensitive data is exposed in client code

### 7. Performance Optimization

- [ ] Database indexes are created for frequently queried columns
- [ ] Images are optimized and compressed
- [ ] Code splitting is working correctly
- [ ] Bundle size is reasonable

## 🎯 Next Steps After Setup

1. **Test all user flows** end-to-end
2. **Verify responsive design** on different devices
3. **Check for any console errors**
4. **Test file upload functionality**
5. **Verify email notifications** (if implemented)
6. **Deploy to production**

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your environment variables are correct
3. Check the Supabase dashboard for any errors
4. Review the RLS policies are correctly applied

**Good luck with your Feleg application! 🚀** 