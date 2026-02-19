import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Fetch the current manager's hotel listing
export function useManagerListing() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["manager-listing", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("hotel_listings")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Fetch all hotel listings (for admin)
export function useAllListings(status?: string) {
  return useQuery({
    queryKey: ["all-listings", status],
    queryFn: async () => {
      let query = supabase.from("hotel_listings").select("*").order("created_at", { ascending: false });
      if (status && status !== "all") {
        query = query.eq("status", status);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch live listings (for customer search)
export function useLiveListings() {
  return useQuery({
    queryKey: ["live-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_listings")
        .select("*")
        .eq("status", "live")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch reservations for a specific hotel (manager view)
export function useHotelReservations(hotelListingId?: string) {
  return useQuery({
    queryKey: ["hotel-reservations", hotelListingId],
    queryFn: async () => {
      if (!hotelListingId) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("hotel_listing_id", hotelListingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!hotelListingId,
  });
}

// Fetch all reservations (admin view)
export function useAllReservations() {
  return useQuery({
    queryKey: ["all-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch user's own reservations (customer view)
export function useMyReservations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-reservations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Fetch reviews for a hotel
export function useHotelReviews(hotelListingId?: string) {
  return useQuery({
    queryKey: ["hotel-reviews", hotelListingId],
    queryFn: async () => {
      if (!hotelListingId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("hotel_listing_id", hotelListingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!hotelListingId,
  });
}

// Fetch all reviews (admin)
export function useAllReviews() {
  return useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch availability slots for a hotel
export function useAvailabilitySlots(hotelListingId?: string, date?: string) {
  return useQuery({
    queryKey: ["availability-slots", hotelListingId, date],
    queryFn: async () => {
      if (!hotelListingId) return [];
      let query = supabase
        .from("availability_slots")
        .select("*")
        .eq("hotel_listing_id", hotelListingId);
      if (date) {
        query = query.eq("slot_date", date);
      }
      const { data, error } = await query.order("start_hour", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!hotelListingId,
  });
}

// Fetch notifications for current user
export function useMyNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Mutation: Update reservation status
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("reservations")
        .update({ status: status as any })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
    },
  });
}

// Mutation: Create/update availability slot
export function useUpsertAvailabilitySlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: {
      id?: string;
      hotel_listing_id: string;
      room_type_id: string;
      slot_date: string;
      start_hour: number;
      end_hour: number;
      rooms_listed: number;
      rooms_booked?: number;
      price_override?: number;
    }) => {
      if (slot.id) {
        const { error } = await supabase
          .from("availability_slots")
          .update(slot)
          .eq("id", slot.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("availability_slots")
          .insert(slot);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-slots"] });
    },
  });
}

// Mutation: Submit a review
export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      user_id: string;
      hotel_listing_id: string;
      reservation_id?: string;
      rating: number;
      title?: string;
      review_text: string;
      room_type?: string;
    }) => {
      const { error } = await supabase.from("reviews").insert(review);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all-reviews"] });
    },
  });
}

// Mutation: Manager respond to review
export function useRespondToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ manager_response: response, manager_responded_at: new Date().toISOString() })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all-reviews"] });
    },
  });
}

// Mutation: Mark notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
    },
  });
}

// Mutation: Update hotel listing
export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from("hotel_listings")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-listing"] });
      queryClient.invalidateQueries({ queryKey: ["all-listings"] });
      queryClient.invalidateQueries({ queryKey: ["live-listings"] });
    },
  });
}

// Fetch all profiles (admin)
export function useAllProfiles() {
  return useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
