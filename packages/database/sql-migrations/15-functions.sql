-- Create updatedAt column update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = now();

RETURN NEW;

END;

$$ language 'plpgsql';