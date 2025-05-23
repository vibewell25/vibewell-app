# VibeWell Database Migration Instructions

This document provides step-by-step instructions for executing the SQL migration files to set up the missing tables and configurations in the Supabase database.

## Prerequisites

1. Access to the Supabase dashboard for the VibeWell project
2. Admin privileges to execute SQL statements

## Migration Steps

### Step 1: Create the exec_sql function

First, create the SQL execution function that will allow you to run SQL statements with elevated privileges:

1. Go to the Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Paste the following SQL:

```sql
-- Create a function to execute SQL statements
-- This function requires superuser privileges
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
```

5. Execute the query

### Step 2: Execute the SQL files in order

Execute each SQL file in the following order:

1. `15-functions.sql` - Creates necessary functions
2. `01-orders.sql` through `14-booking_reminders.sql` - Creates the tables
3. `16-triggers.sql` - Sets up database triggers
4. `17-indexes.sql` - Creates indexes for better performance
5. `18-rls.sql` - Enables Row Level Security on tables
6. `19-policies.sql` - Creates RLS policies

For each file:
1. Open a new query in the SQL Editor
2. Copy the contents of the SQL file
3. Execute the query
4. Verify that the execution was successful

### Step 3: Verify the migration

After executing all SQL files, verify that the tables were created properly:

1. Go to the "Table Editor" in Supabase
2. Check that all the following tables exist:
   - orders
   - order_items
   - conversations
   - messages
   - certificates
   - blog_posts
   - blog_categories
   - blog_comments
   - skin_analyses
   - ai_recommendations
   - virtual_tryons
   - provider_schedules
   - provider_breaks
   - booking_reminders

3. Verify that each table has the correct columns and constraints

### Step 4: Update the Prisma schema (if needed)

If you've made any changes to the database schema during the migration, make sure to update the Prisma schema accordingly:

```bash
cd packages/database
npx prisma db pull
npx prisma generate
```

## Troubleshooting

If you encounter errors during the migration:

1. **Table already exists**: You can safely ignore these errors
2. **Permission denied**: Make sure you're using the correct Supabase admin credentials
3. **Syntax errors**: Check the SQL syntax and fix any issues
4. **Dependency errors**: Make sure you're executing the files in the correct order

## Additional Notes

- The certificates table is particularly important for the course completion functionality
- Make sure the RLS policies are properly set up to ensure data security
- After the migration, test the certificate generation functionality in the application 