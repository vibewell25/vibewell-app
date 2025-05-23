-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "customerId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  total DECIMAL(10, 2) NOT NULL,
  "paymentIntentId" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);