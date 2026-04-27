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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          categories: string[] | null
          certifications: string[] | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          email: string | null
          established_year: number | null
          gstin: string | null
          id: string
          is_hidden: boolean
          is_verified: boolean
          logo_url: string | null
          membership_tier: string | null
          name: string
          owner_id: string
          phone: string | null
          slug: string
          social_links: Json | null
          state: string | null
          tagline: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          gstin?: string | null
          id?: string
          is_hidden?: boolean
          is_verified?: boolean
          logo_url?: string | null
          membership_tier?: string | null
          name: string
          owner_id: string
          phone?: string | null
          slug: string
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          gstin?: string | null
          id?: string
          is_hidden?: boolean
          is_verified?: boolean
          logo_url?: string | null
          membership_tier?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          slug?: string
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          certifications: string[] | null
          created_at: string
          grade: string | null
          id: string
          is_active: boolean
          lead_time_days: number | null
          moq: number | null
          moq_unit: string | null
          name: string
          packaging: string | null
          price_max: number | null
          price_min: number | null
          price_unit: string | null
          product_id: string
          sku: string | null
          sort_order: number
          stock_band: Database["public"]["Enums"]["stock_band"] | null
          updated_at: string
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number | null
          moq?: number | null
          moq_unit?: string | null
          name: string
          packaging?: string | null
          price_max?: number | null
          price_min?: number | null
          price_unit?: string | null
          product_id: string
          sku?: string | null
          sort_order?: number
          stock_band?: Database["public"]["Enums"]["stock_band"] | null
          updated_at?: string
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number | null
          moq?: number | null
          moq_unit?: string | null
          name?: string
          packaging?: string | null
          price_max?: number | null
          price_min?: number | null
          price_unit?: string | null
          product_id?: string
          sku?: string | null
          sort_order?: number
          stock_band?: Database["public"]["Enums"]["stock_band"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          certifications: string[] | null
          company_id: string
          created_at: string
          demand_score: number | null
          description: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          inquiry_count: number
          is_featured: boolean
          is_hidden: boolean
          market_avg_price: number | null
          name: string
          origin: string | null
          packaging_options: string[] | null
          price_max: number | null
          price_min: number | null
          slug: string
          stock_band: Database["public"]["Enums"]["stock_band"] | null
          trend_direction: Database["public"]["Enums"]["trend_direction"] | null
          unit: string | null
          updated_at: string
          view_count: number
        }
        Insert: {
          category?: string | null
          certifications?: string[] | null
          company_id: string
          created_at?: string
          demand_score?: number | null
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          inquiry_count?: number
          is_featured?: boolean
          is_hidden?: boolean
          market_avg_price?: number | null
          name: string
          origin?: string | null
          packaging_options?: string[] | null
          price_max?: number | null
          price_min?: number | null
          slug: string
          stock_band?: Database["public"]["Enums"]["stock_band"] | null
          trend_direction?:
            | Database["public"]["Enums"]["trend_direction"]
            | null
          unit?: string | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string | null
          certifications?: string[] | null
          company_id?: string
          created_at?: string
          demand_score?: number | null
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          inquiry_count?: number
          is_featured?: boolean
          is_hidden?: boolean
          market_avg_price?: number | null
          name?: string
          origin?: string | null
          packaging_options?: string[] | null
          price_max?: number | null
          price_min?: number | null
          slug?: string
          stock_band?: Database["public"]["Enums"]["stock_band"] | null
          trend_direction?:
            | Database["public"]["Enums"]["trend_direction"]
            | null
          unit?: string | null
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          buyer_reputation_score: number
          company_name: string | null
          company_verified_at: string | null
          created_at: string
          designation: string | null
          email_verified_at: string | null
          full_name: string | null
          gst_verified_at: string | null
          gstin: string | null
          id: string
          is_broker: boolean
          phone: string | null
          rfq_count: number
          rfq_response_rate: number
          updated_at: string
          verification_tier: Database["public"]["Enums"]["verification_tier"]
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          buyer_reputation_score?: number
          company_name?: string | null
          company_verified_at?: string | null
          created_at?: string
          designation?: string | null
          email_verified_at?: string | null
          full_name?: string | null
          gst_verified_at?: string | null
          gstin?: string | null
          id: string
          is_broker?: boolean
          phone?: string | null
          rfq_count?: number
          rfq_response_rate?: number
          updated_at?: string
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          buyer_reputation_score?: number
          company_name?: string | null
          company_verified_at?: string | null
          created_at?: string
          designation?: string | null
          email_verified_at?: string | null
          full_name?: string | null
          gst_verified_at?: string | null
          gstin?: string | null
          id?: string
          is_broker?: boolean
          phone?: string | null
          rfq_count?: number
          rfq_response_rate?: number
          updated_at?: string
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
        }
        Relationships: []
      }
      rfq_responses: {
        Row: {
          created_at: string
          id: string
          message: string | null
          price_quoted: number | null
          responder_id: string
          rfq_id: string
          unit: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          price_quoted?: number | null
          responder_id: string
          rfq_id: string
          unit?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          price_quoted?: number | null
          responder_id?: string
          rfq_id?: string
          unit?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfq_responses_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          buyer_company: string | null
          buyer_email: string | null
          buyer_id: string
          buyer_name: string | null
          buyer_phone: string | null
          company_id: string
          created_at: string
          delivery_location: string | null
          delivery_timeline: string | null
          id: string
          message: string | null
          packaging: string | null
          priority_score: number
          product_id: string | null
          product_name: string
          quantity: string
          status: Database["public"]["Enums"]["rfq_status"]
          updated_at: string
        }
        Insert: {
          buyer_company?: string | null
          buyer_email?: string | null
          buyer_id: string
          buyer_name?: string | null
          buyer_phone?: string | null
          company_id: string
          created_at?: string
          delivery_location?: string | null
          delivery_timeline?: string | null
          id?: string
          message?: string | null
          packaging?: string | null
          priority_score?: number
          product_id?: string | null
          product_name: string
          quantity: string
          status?: Database["public"]["Enums"]["rfq_status"]
          updated_at?: string
        }
        Update: {
          buyer_company?: string | null
          buyer_email?: string | null
          buyer_id?: string
          buyer_name?: string | null
          buyer_phone?: string | null
          company_id?: string
          created_at?: string
          delivery_location?: string | null
          delivery_timeline?: string | null
          id?: string
          message?: string | null
          packaging?: string | null
          priority_score?: number
          product_id?: string | null
          product_name?: string
          quantity?: string
          status?: Database["public"]["Enums"]["rfq_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          designation: string | null
          full_name: string | null
          id: string | null
          verification_tier:
            | Database["public"]["Enums"]["verification_tier"]
            | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          designation?: string | null
          full_name?: string | null
          id?: string | null
          verification_tier?:
            | Database["public"]["Enums"]["verification_tier"]
            | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          designation?: string | null
          full_name?: string | null
          id?: string | null
          verification_tier?:
            | Database["public"]["Enums"]["verification_tier"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_buyer_reputation_tier: { Args: { _score: number }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "broker" | "paid_member" | "free_member"
      rfq_status:
        | "new"
        | "viewed"
        | "responded"
        | "negotiating"
        | "converted"
        | "closed"
      stock_band: "high" | "medium" | "low" | "on_order"
      trend_direction: "rising" | "stable" | "falling"
      verification_tier: "unverified" | "email" | "company" | "gst"
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
      app_role: ["admin", "broker", "paid_member", "free_member"],
      rfq_status: [
        "new",
        "viewed",
        "responded",
        "negotiating",
        "converted",
        "closed",
      ],
      stock_band: ["high", "medium", "low", "on_order"],
      trend_direction: ["rising", "stable", "falling"],
      verification_tier: ["unverified", "email", "company", "gst"],
    },
  },
} as const
