
-- 1. User Roles (RBAC)
CREATE TYPE public.app_role AS ENUM ('admin', 'hotel_manager', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can read their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  hotel_listing_id uuid REFERENCES public.hotel_listings(id) ON DELETE CASCADE NOT NULL,
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text NOT NULL,
  room_type text,
  status text NOT NULL DEFAULT 'published',
  manager_response text,
  manager_responded_at timestamptz,
  helpful_count integer NOT NULL DEFAULT 0,
  reported_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published reviews"
ON public.reviews FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can view own reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Hotel managers can respond to reviews on their listings
CREATE POLICY "Managers can update reviews on their listings"
ON public.reviews FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.hotel_listings
    WHERE hotel_listings.id = reviews.hotel_listing_id
    AND hotel_listings.user_id = auth.uid()
  )
);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
ON public.reviews FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Availability Slots table
CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_listing_id uuid REFERENCES public.hotel_listings(id) ON DELETE CASCADE NOT NULL,
  room_type_id text NOT NULL,
  slot_date date NOT NULL,
  start_hour integer NOT NULL,
  end_hour integer NOT NULL,
  rooms_listed integer NOT NULL DEFAULT 1,
  rooms_booked integer NOT NULL DEFAULT 0,
  price_override numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view slots for live listings (for booking)
CREATE POLICY "Anyone can view slots for live listings"
ON public.availability_slots FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hotel_listings
    WHERE hotel_listings.id = availability_slots.hotel_listing_id
    AND hotel_listings.status = 'live'
  )
);

-- Managers can manage their own slots
CREATE POLICY "Managers can manage own slots"
ON public.availability_slots FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.hotel_listings
    WHERE hotel_listings.id = availability_slots.hotel_listing_id
    AND hotel_listings.user_id = auth.uid()
  )
);

-- Admins can manage all slots
CREATE POLICY "Admins can manage all slots"
ON public.availability_slots FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_availability_slots_updated_at
BEFORE UPDATE ON public.availability_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Add hotel_listing_id to reservations for linking
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS hotel_listing_id uuid REFERENCES public.hotel_listings(id) ON DELETE SET NULL;

-- 6. Indexes for performance
CREATE INDEX idx_reviews_hotel ON public.reviews(hotel_listing_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_availability_hotel_date ON public.availability_slots(hotel_listing_id, slot_date);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX idx_reservations_hotel ON public.reservations(hotel_listing_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
