
-- Create hotel_listings table for property onboarding
CREATE TABLE public.hotel_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, live

  -- Basic Info
  hotel_name TEXT NOT NULL,
  hotel_description TEXT,
  hotel_email TEXT NOT NULL,
  hotel_phone TEXT NOT NULL,
  contact_person_name TEXT,
  contact_person_email TEXT,
  contact_person_phone TEXT,

  -- Address
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  neighborhood TEXT,

  -- Room types (JSON array of {name, description, capacity, hourly_rate})
  room_types JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Hours (JSON array of {label, start, end})
  available_hours JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Amenities & Facilities (booleans)
  has_parking BOOLEAN NOT NULL DEFAULT false,
  has_gym BOOLEAN NOT NULL DEFAULT false,
  has_pool BOOLEAN NOT NULL DEFAULT false,
  has_wifi BOOLEAN NOT NULL DEFAULT false,
  has_breakfast BOOLEAN NOT NULL DEFAULT false,
  has_room_service BOOLEAN NOT NULL DEFAULT false,
  has_spa BOOLEAN NOT NULL DEFAULT false,
  has_bar BOOLEAN NOT NULL DEFAULT false,
  has_restaurant BOOLEAN NOT NULL DEFAULT false,
  has_business_center BOOLEAN NOT NULL DEFAULT false,
  has_laundry BOOLEAN NOT NULL DEFAULT false,
  has_concierge BOOLEAN NOT NULL DEFAULT false,
  has_ev_charging BOOLEAN NOT NULL DEFAULT false,
  has_pet_friendly BOOLEAN NOT NULL DEFAULT false,
  has_accessible BOOLEAN NOT NULL DEFAULT false,
  additional_amenities TEXT[],

  -- Policies
  cancellation_policy TEXT,
  age_restriction INTEGER DEFAULT 18,
  check_in_policy TEXT,
  smoking_policy TEXT NOT NULL DEFAULT 'non-smoking',
  pet_policy TEXT,
  additional_policies TEXT,

  -- Photos (array of URLs)
  photos TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hotel_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own listings"
ON public.hotel_listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own listings"
ON public.hotel_listings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
ON public.hotel_listings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view live listings"
ON public.hotel_listings FOR SELECT
USING (status = 'live');

CREATE TRIGGER update_hotel_listings_updated_at
BEFORE UPDATE ON public.hotel_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
