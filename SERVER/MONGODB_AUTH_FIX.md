# MongoDB Authentication Fix

## Issue
Authentication failed: `bad auth : authentication failed`

## Possible Causes

1. **Password Encoding**: The password `abhi@123` needs to be URL-encoded as `abhi%40123` in the connection string
   - `@` becomes `%40`
   - Already fixed in `.env`

2. **Wrong Password**: The actual password in MongoDB Atlas might be different
   - Check MongoDB Atlas → Database Access → User `abhi`
   - Verify the password matches

3. **User Permissions**: The user might not have proper permissions
   - Ensure user has "Atlas admin" or "Read and write to any database" role

4. **IP Whitelist**: Your IP might not be whitelisted
   - Go to MongoDB Atlas → Network Access
   - Add your current IP or use `0.0.0.0/0` for testing

## Current Connection String
```
mongodb+srv://abhi:abhi%40123@abhi.cc20rar.mongodb.net/livabhi?retryWrites=true&w=majority
```

## Steps to Fix

1. **Verify Password in MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Database Access → Find user `abhi`
   - Click "Edit" to see/reset password
   - If password is different, update `.env` file

2. **Reset Password (if needed):**
   - In MongoDB Atlas → Database Access
   - Click "Edit" on user `abhi`
   - Click "Autogenerate Secure Password" or set new password
   - Update `.env` with new password (URL-encode special characters)

3. **Check IP Whitelist:**
   - Network Access → Add IP Address
   - Click "Add Current IP Address"
   - Or use `0.0.0.0/0` for all IPs (less secure)

4. **Test Connection:**
   - Restart server
   - Check logs for connection status

## Password Encoding Reference
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

## Alternative: Use MongoDB Atlas Connection String Directly
1. Go to MongoDB Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password (URL-encoded)
5. Add database name: `/livabhi` before the `?`



