-- =============================================
-- Tailor Management System - Complete Database Schema
-- For use with Supabase/PostgreSQL + Go Backend
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

-- Customer tags
CREATE TYPE customer_tag AS ENUM ('VIP', 'Regular', 'Walk-in');

-- Garment types
CREATE TYPE garment_type AS ENUM ('shirt', 'pant', 'kurta', 'koti', 'waistcoat');

-- Order status workflow
CREATE TYPE order_status AS ENUM ('pending', 'cutting', 'stitching', 'trial', 'ready', 'delivered', 'cancelled');

-- Payment status
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');

-- Urgency level
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'express');

-- =============================================
-- 1. PROFILES TABLE (Shop owners/Tailors)
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_name VARCHAR(255),
    owner_name VARCHAR(255),
    mobile VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    logo_url TEXT,
    
    -- Shop settings
    currency VARCHAR(10) DEFAULT '₹',
    default_delivery_days INTEGER DEFAULT 7,
    
    -- Garment base prices (can be overridden per order)
    shirt_price DECIMAL(10, 2) DEFAULT 800,
    pant_price DECIMAL(10, 2) DEFAULT 600,
    kurta_price DECIMAL(10, 2) DEFAULT 1200,
    koti_price DECIMAL(10, 2) DEFAULT 1500,
    waistcoat_price DECIMAL(10, 2) DEFAULT 1800,
    
    -- Urgency multipliers
    urgent_multiplier DECIMAL(4, 2) DEFAULT 1.25,
    express_multiplier DECIMAL(4, 2) DEFAULT 1.50,
    
    -- Language preference
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'gu'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. CUSTOMERS TABLE
-- =============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Basic info
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    
    -- Categorization
    tag customer_tag DEFAULT 'Regular',
    
    -- Notes & additional info
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate mobile per user
    UNIQUE(user_id, mobile)
);

-- Indexes for fast lookup
CREATE INDEX idx_customers_mobile ON customers(mobile);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_tag ON customers(tag);

-- =============================================
-- 3. MEASUREMENTS TABLE
-- =============================================
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    garment_type garment_type NOT NULL,
    
    -- Measurement data stored as JSONB for flexibility
    -- Each garment type has different fields:
    
    -- SHIRT fields:
    -- length, chest, waist, shoulder, sleeveLength, sleeveOpening, 
    -- collar, armHole, cuffSize, frontChest, backWidth
    
    -- PANT fields:
    -- length, waist, hip, thigh, knee, bottom, crotch, rise, inseam
    
    -- KURTA fields:
    -- length, chest, waist, shoulder, sleeveLength, sleeveOpening,
    -- collar, armHole, slit, daaman
    
    -- KOTI fields:
    -- length, chest, waist, shoulder, armHole, frontOpening, backWidth
    
    -- WAISTCOAT fields:
    -- length, chest, waist, shoulder, armHole, frontLength, backLength
    
    data JSONB NOT NULL DEFAULT '{}',
    
    -- Additional info
    notes TEXT,
    reference_image_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_measurements_customer_id ON measurements(customer_id);
CREATE INDEX idx_measurements_user_id ON measurements(user_id);
CREATE INDEX idx_measurements_garment_type ON measurements(garment_type);
CREATE INDEX idx_measurements_created_at ON measurements(created_at DESC);

-- =============================================
-- 4. ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Order identification
    order_number VARCHAR(50) NOT NULL,
    
    -- Financial
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    -- Status tracking
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'unpaid',
    
    -- Priority & scheduling
    urgency urgency_level DEFAULT 'normal',
    delivery_date DATE NOT NULL,
    
    -- Additional info
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique order number per user
    UNIQUE(user_id, order_number)
);

-- Indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =============================================
-- 5. ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Item details
    garment_type garment_type NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    
    -- Link to measurement (optional - can be edited inline)
    measurement_id UUID REFERENCES measurements(id) ON DELETE SET NULL,
    
    -- Snapshot of measurement at time of order
    -- (preserves measurement even if original is updated later)
    measurement_snapshot JSONB,
    
    -- Item-specific notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_measurement_id ON order_items(measurement_id);
CREATE INDEX idx_order_items_garment_type ON order_items(garment_type);

-- =============================================
-- 6. ORDER STATUS HISTORY (Audit Trail)
-- =============================================
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Status change
    old_status order_status,
    new_status order_status NOT NULL,
    
    -- Who made the change
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Notes about the change
    notes TEXT,
    
    -- When
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- =============================================
-- 7. PAYMENT HISTORY
-- =============================================
CREATE TABLE payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50), -- 'cash', 'upi', 'card', 'bank_transfer'
    
    -- Reference/transaction ID (for digital payments)
    transaction_reference VARCHAR(100),
    
    -- Notes
    notes TEXT,
    
    -- Recorded by
    recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- When
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_history_order_id ON payment_history(order_id);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at DESC);

-- =============================================
-- 8. SYNC QUEUE (For Offline-First Operation)
-- =============================================
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- What entity was changed
    entity_type VARCHAR(50) NOT NULL, -- 'customer', 'measurement', 'order', 'order_item'
    entity_id UUID NOT NULL,
    
    -- What operation
    operation VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    
    -- The data (for creates/updates)
    payload JSONB,
    
    -- Sync status
    synced BOOLEAN DEFAULT FALSE,
    sync_error TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_user_id ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_synced ON sync_queue(synced);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);

-- =============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- CUSTOMERS policies
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid() = user_id);

-- MEASUREMENTS policies
CREATE POLICY "Users can view own measurements" ON measurements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements" ON measurements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements" ON measurements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements" ON measurements
    FOR DELETE USING (auth.uid() = user_id);

-- ORDERS policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders" ON orders
    FOR DELETE USING (auth.uid() = user_id);

-- ORDER_ITEMS policies (access through parent order)
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can insert own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can update own order items" ON order_items
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can delete own order items" ON order_items
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

-- ORDER_STATUS_HISTORY policies
CREATE POLICY "Users can view own order status history" ON order_status_history
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can insert own order status history" ON order_status_history
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid())
    );

-- PAYMENT_HISTORY policies
CREATE POLICY "Users can view own payment history" ON payment_history
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = payment_history.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can insert own payment history" ON payment_history
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = payment_history.order_id AND orders.user_id = auth.uid())
    );

-- SYNC_QUEUE policies
CREATE POLICY "Users can manage own sync queue" ON sync_queue
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 10. TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_measurements_updated_at
    BEFORE UPDATE ON measurements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update payment status based on paid amount
CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.paid_amount >= NEW.total_amount THEN
        NEW.payment_status := 'paid';
    ELSIF NEW.paid_amount > 0 THEN
        NEW.payment_status := 'partial';
    ELSE
        NEW.payment_status := 'unpaid';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_payment_status
    BEFORE INSERT OR UPDATE OF paid_amount, total_amount ON orders
    FOR EACH ROW EXECUTE FUNCTION update_payment_status();

-- Track order status changes
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_order_status
    AFTER UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION track_order_status_change();

-- =============================================
-- 11. FUNCTIONS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, shop_name, owner_name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'shop_name',
        NEW.raw_user_meta_data ->> 'owner_name',
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number(p_user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_count INTEGER;
    v_date VARCHAR;
BEGIN
    SELECT COUNT(*) + 1 INTO v_count
    FROM orders
    WHERE user_id = p_user_id
    AND DATE(created_at) = CURRENT_DATE;
    
    v_date := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    RETURN 'ORD-' || v_date || '-' || LPAD(v_count::VARCHAR, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Get customer statistics
CREATE OR REPLACE FUNCTION get_customer_stats(p_user_id UUID, p_customer_id UUID)
RETURNS TABLE (
    total_orders BIGINT,
    total_spent DECIMAL,
    pending_balance DECIMAL,
    last_order_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_orders,
        COALESCE(SUM(total_amount), 0)::DECIMAL as total_spent,
        COALESCE(SUM(total_amount - paid_amount), 0)::DECIMAL as pending_balance,
        MAX(created_at) as last_order_date
    FROM orders
    WHERE user_id = p_user_id AND customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary(p_user_id UUID)
RETURNS TABLE (
    total_customers BIGINT,
    total_orders BIGINT,
    pending_orders BIGINT,
    orders_this_month BIGINT,
    revenue_this_month DECIMAL,
    pending_payments DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM customers WHERE user_id = p_user_id)::BIGINT,
        (SELECT COUNT(*) FROM orders WHERE user_id = p_user_id)::BIGINT,
        (SELECT COUNT(*) FROM orders WHERE user_id = p_user_id AND status NOT IN ('delivered', 'cancelled'))::BIGINT,
        (SELECT COUNT(*) FROM orders WHERE user_id = p_user_id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))::BIGINT,
        (SELECT COALESCE(SUM(paid_amount), 0) FROM orders WHERE user_id = p_user_id AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))::DECIMAL,
        (SELECT COALESCE(SUM(total_amount - paid_amount), 0) FROM orders WHERE user_id = p_user_id AND payment_status != 'paid')::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search customers by name or mobile
CREATE OR REPLACE FUNCTION search_customers(p_user_id UUID, p_query TEXT)
RETURNS SETOF customers AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM customers
    WHERE user_id = p_user_id
    AND (
        name ILIKE '%' || p_query || '%'
        OR mobile ILIKE '%' || p_query || '%'
    )
    ORDER BY 
        CASE WHEN mobile = p_query THEN 0 ELSE 1 END, -- Exact mobile match first
        name
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get latest measurement for a customer by garment type
CREATE OR REPLACE FUNCTION get_latest_measurement(p_customer_id UUID, p_garment_type garment_type)
RETURNS measurements AS $$
DECLARE
    result measurements;
BEGIN
    SELECT * INTO result
    FROM measurements
    WHERE customer_id = p_customer_id AND garment_type = p_garment_type
    ORDER BY updated_at DESC
    LIMIT 1;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 12. VIEWS (For common queries)
-- =============================================

-- Orders with customer info
CREATE OR REPLACE VIEW orders_with_customer AS
SELECT 
    o.*,
    c.name as customer_name,
    c.mobile as customer_mobile,
    c.tag as customer_tag
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- Pending deliveries (orders due today or overdue)
CREATE OR REPLACE VIEW pending_deliveries AS
SELECT 
    o.*,
    c.name as customer_name,
    c.mobile as customer_mobile,
    CASE 
        WHEN o.delivery_date < CURRENT_DATE THEN 'overdue'
        WHEN o.delivery_date = CURRENT_DATE THEN 'due_today'
        ELSE 'upcoming'
    END as delivery_status
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status NOT IN ('delivered', 'cancelled')
ORDER BY o.delivery_date;
