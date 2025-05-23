# SQL Migration Files for VibeWell

These SQL files contain the necessary statements to create the missing tables and set up RLS policies for the VibeWell application.

## How to Use

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Execute the SQL files in numerical order (they are prefixed with numbers)
4. Start with the function definitions (usually 01-functions.sql)
5. Then create tables, indexes, and finally RLS policies

## Important Notes

- Make sure to execute the files in order
- Some statements might fail if the tables already exist or if there are dependency issues
- You may need to modify the SQL statements if you encounter errors

## Files Overview

01-orders.sql: 1 statements
02-order_items.sql: 1 statements
03-conversations.sql: 1 statements
04-messages.sql: 1 statements
05-certificates.sql: 1 statements
06-blog_posts.sql: 1 statements
07-blog_categories.sql: 1 statements
08-blog_comments.sql: 1 statements
09-skin_analyses.sql: 1 statements
10-ai_recommendations.sql: 1 statements
11-virtual_tryons.sql: 1 statements
12-provider_schedules.sql: 1 statements
13-provider_breaks.sql: 1 statements
14-booking_reminders.sql: 1 statements
15-functions.sql: 4 statements
16-triggers.sql: 14 statements
17-indexes.sql: 19 statements
18-rls.sql: 14 statements
19-policies.sql: 23 statements

