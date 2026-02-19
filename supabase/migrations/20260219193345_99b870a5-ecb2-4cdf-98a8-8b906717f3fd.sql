-- Add tax columns to hotel_listings
ALTER TABLE public.hotel_listings
ADD COLUMN tax_rate numeric NOT NULL DEFAULT 0,
ADD COLUMN tax_flat_fee numeric NOT NULL DEFAULT 0;