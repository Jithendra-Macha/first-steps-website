
-- Add platform commission column (flat $5 per booking)
ALTER TABLE public.reservations ADD COLUMN platform_commission numeric NOT NULL DEFAULT 5;

-- Add guest info columns for non-logged-in users
ALTER TABLE public.reservations ADD COLUMN guest_name text;
ALTER TABLE public.reservations ADD COLUMN guest_email text;
ALTER TABLE public.reservations ADD COLUMN guest_phone text;

-- Make user_id nullable so guests can book without an account
ALTER TABLE public.reservations ALTER COLUMN user_id DROP NOT NULL;

-- Allow anonymous inserts (guest checkout)
CREATE POLICY "Allow guest reservations"
ON public.reservations
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Allow anyone to view reservations by booking_id (for guest confirmation)
CREATE POLICY "Anyone can view by booking_id"
ON public.reservations
FOR SELECT
TO anon
USING (user_id IS NULL);

-- Allow hotel managers to view reservations for their listings
CREATE POLICY "Managers can view their hotel reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hotel_listings
    WHERE hotel_listings.id = reservations.hotel_listing_id
    AND hotel_listings.user_id = auth.uid()
  )
);

-- Allow admins to view all reservations
CREATE POLICY "Admins can view all reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage all reservations
CREATE POLICY "Admins can manage all reservations"
ON public.reservations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
