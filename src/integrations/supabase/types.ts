export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string
          end_hour: number
          hotel_listing_id: string
          id: string
          price_override: number | null
          room_type_id: string
          rooms_booked: number
          rooms_listed: number
          slot_date: string
          start_hour: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_hour: number
          hotel_listing_id: string
          id?: string
          price_override?: number | null
          room_type_id: string
          rooms_booked?: number
          rooms_listed?: number
          slot_date: string
          start_hour: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_hour?: number
          hotel_listing_id?: string
          id?: string
          price_override?: number | null
          room_type_id?: string
          rooms_booked?: number
          rooms_listed?: number
          slot_date?: string
          start_hour?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_hotel_listing_id_fkey"
            columns: ["hotel_listing_id"]
            isOneToOne: false
            referencedRelation: "hotel_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_listings: {
        Row: {
          additional_amenities: string[] | null
          additional_policies: string | null
          age_restriction: number | null
          available_hours: Json
          cancellation_policy: string | null
          check_in_policy: string | null
          city: string
          contact_person_email: string | null
          contact_person_name: string | null
          contact_person_phone: string | null
          created_at: string
          has_accessible: boolean
          has_bar: boolean
          has_breakfast: boolean
          has_business_center: boolean
          has_concierge: boolean
          has_ev_charging: boolean
          has_gym: boolean
          has_laundry: boolean
          has_parking: boolean
          has_pet_friendly: boolean
          has_pool: boolean
          has_restaurant: boolean
          has_room_service: boolean
          has_spa: boolean
          has_wifi: boolean
          hotel_description: string | null
          hotel_email: string
          hotel_name: string
          hotel_phone: string
          id: string
          neighborhood: string | null
          pet_policy: string | null
          photos: string[] | null
          room_types: Json
          smoking_policy: string
          state: string
          status: string
          street_address: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          additional_amenities?: string[] | null
          additional_policies?: string | null
          age_restriction?: number | null
          available_hours?: Json
          cancellation_policy?: string | null
          check_in_policy?: string | null
          city: string
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          has_accessible?: boolean
          has_bar?: boolean
          has_breakfast?: boolean
          has_business_center?: boolean
          has_concierge?: boolean
          has_ev_charging?: boolean
          has_gym?: boolean
          has_laundry?: boolean
          has_parking?: boolean
          has_pet_friendly?: boolean
          has_pool?: boolean
          has_restaurant?: boolean
          has_room_service?: boolean
          has_spa?: boolean
          has_wifi?: boolean
          hotel_description?: string | null
          hotel_email: string
          hotel_name: string
          hotel_phone: string
          id?: string
          neighborhood?: string | null
          pet_policy?: string | null
          photos?: string[] | null
          room_types?: Json
          smoking_policy?: string
          state: string
          status?: string
          street_address: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          additional_amenities?: string[] | null
          additional_policies?: string | null
          age_restriction?: number | null
          available_hours?: Json
          cancellation_policy?: string | null
          check_in_policy?: string | null
          city?: string
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          has_accessible?: boolean
          has_bar?: boolean
          has_breakfast?: boolean
          has_business_center?: boolean
          has_concierge?: boolean
          has_ev_charging?: boolean
          has_gym?: boolean
          has_laundry?: boolean
          has_parking?: boolean
          has_pet_friendly?: boolean
          has_pool?: boolean
          has_restaurant?: boolean
          has_room_service?: boolean
          has_spa?: boolean
          has_wifi?: boolean
          hotel_description?: string | null
          hotel_email?: string
          hotel_name?: string
          hotel_phone?: string
          id?: string
          neighborhood?: string | null
          pet_policy?: string | null
          photos?: string[] | null
          room_types?: Json
          smoking_policy?: string
          state?: string
          status?: string
          street_address?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          booking_id: string
          check_in_date: string
          check_out_date: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          guests: number
          hotel_address: string | null
          hotel_image: string | null
          hotel_listing_id: string | null
          hotel_name: string
          id: string
          platform_commission: number
          room_type: string
          status: Database["public"]["Enums"]["reservation_status"]
          time_slot: string | null
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_id: string
          check_in_date: string
          check_out_date?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          hotel_address?: string | null
          hotel_image?: string | null
          hotel_listing_id?: string | null
          hotel_name: string
          id?: string
          platform_commission?: number
          room_type: string
          status?: Database["public"]["Enums"]["reservation_status"]
          time_slot?: string | null
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string
          check_in_date?: string
          check_out_date?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          hotel_address?: string | null
          hotel_image?: string | null
          hotel_listing_id?: string | null
          hotel_name?: string
          id?: string
          platform_commission?: number
          room_type?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          time_slot?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_hotel_listing_id_fkey"
            columns: ["hotel_listing_id"]
            isOneToOne: false
            referencedRelation: "hotel_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          helpful_count: number
          hotel_listing_id: string
          id: string
          manager_responded_at: string | null
          manager_response: string | null
          rating: number
          reported_count: number
          reservation_id: string | null
          review_text: string
          room_type: string | null
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_count?: number
          hotel_listing_id: string
          id?: string
          manager_responded_at?: string | null
          manager_response?: string | null
          rating: number
          reported_count?: number
          reservation_id?: string | null
          review_text: string
          room_type?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_count?: number
          hotel_listing_id?: string
          id?: string
          manager_responded_at?: string | null
          manager_response?: string | null
          rating?: number
          reported_count?: number
          reservation_id?: string | null
          review_text?: string
          room_type?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_hotel_listing_id_fkey"
            columns: ["hotel_listing_id"]
            isOneToOne: false
            referencedRelation: "hotel_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hotel_manager" | "customer"
      reservation_status: "upcoming" | "past" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hotel_manager", "customer"],
      reservation_status: ["upcoming", "past", "cancelled"],
    },
  },
} as const
