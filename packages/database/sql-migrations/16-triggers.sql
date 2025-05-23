-- Create updatedAt triggers for all tables
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at 
BEFORE UPDATE ON order_items 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
BEFORE UPDATE ON conversations 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
BEFORE UPDATE ON messages 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at 
BEFORE UPDATE ON certificates 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at 
BEFORE UPDATE ON blog_categories
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
BEFORE UPDATE ON blog_comments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_skin_analyses_updated_at 
BEFORE UPDATE ON skin_analyses
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at 
BEFORE UPDATE ON ai_recommendations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_virtual_tryons_updated_at 
BEFORE UPDATE ON virtual_tryons
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_provider_schedules_updated_at 
BEFORE UPDATE ON provider_schedules
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_provider_breaks_updated_at 
BEFORE UPDATE ON provider_breaks
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_booking_reminders_updated_at 
BEFORE UPDATE ON booking_reminders
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();