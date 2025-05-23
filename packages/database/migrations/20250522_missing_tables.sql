-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customerId UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  total DECIMAL(10, 2) NOT NULL,
  paymentIntentId TEXT,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderId UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  productId UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table for chat functionality
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  lastMessageAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversationId UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  senderId UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  isRead BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create updatedAt triggers for new tables
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

-- Create indexes for better performance
CREATE INDEX idx_orders_customerId ON orders("customerId");
CREATE INDEX idx_order_items_orderId ON order_items("orderId");
CREATE INDEX idx_order_items_productId ON order_items("productId");
CREATE INDEX idx_conversations_participants ON conversations USING GIN ("participants");
CREATE INDEX idx_messages_conversationId ON messages("conversationId");
CREATE INDEX idx_messages_senderId ON messages("senderId");

-- Set up RLS policies for new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() IN (
  SELECT "userId" FROM profiles WHERE id = "customerId"
));

CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT "userId" FROM profiles WHERE id = "customerId"
));

-- RLS policies for order_items
CREATE POLICY "Users can view their order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items."orderId"
    AND orders."customerId" IN (
      SELECT id FROM profiles WHERE "userId" = auth.uid()
    )
  )
);

-- RLS policies for conversations
CREATE POLICY "Users can view conversations they are part of"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = ANY(conversations.participants)
  )
);

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = ANY(conversations.participants)
  )
);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages."conversationId"
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId" = auth.uid()
      AND profiles.id = ANY(conversations.participants)
    )
  )
);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles."userId" = auth.uid()
    AND profiles.id = messages."senderId"
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages."conversationId"
      AND profiles.id = ANY(conversations.participants)
    )
  )
); 