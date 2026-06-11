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
      advertisements: {
        Row: {
          clicks: number
          created_at: string
          end_date: string | null
          id: string
          image_url: string
          impressions: number
          is_active: boolean
          link_url: string | null
          placement: string
          priority: number
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          end_date?: string | null
          id?: string
          image_url: string
          impressions?: number
          is_active?: boolean
          link_url?: string | null
          placement?: string
          priority?: number
          start_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string
          impressions?: number
          is_active?: boolean
          link_url?: string | null
          placement?: string
          priority?: number
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      analyst_reports: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_active: boolean
          kind: string
          published_at: string
          requires_paid: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          kind?: string
          published_at?: string
          requires_paid?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          kind?: string
          published_at?: string
          requires_paid?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          b2c_url: string | null
          categories: string[]
          company_id: string
          cover_url: string | null
          created_at: string
          gallery: string[]
          id: string
          is_active: boolean
          is_featured: boolean
          logo_url: string | null
          name: string
          slug: string
          social_links: Json
          sort_order: number
          story: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          b2c_url?: string | null
          categories?: string[]
          company_id: string
          cover_url?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name: string
          slug: string
          social_links?: Json
          sort_order?: number
          story?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          b2c_url?: string | null
          categories?: string[]
          company_id?: string
          cover_url?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          social_links?: Json
          sort_order?: number
          story?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      circulars: {
        Row: {
          body: string
          category: string | null
          created_at: string
          created_by: string
          id: string
          is_published: boolean
          published_at: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
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
          hours: string | null
          id: string
          iec: string | null
          is_hidden: boolean
          is_sponsored: boolean
          is_verified: boolean
          languages: string[]
          logo_url: string | null
          markets: string[]
          membership_tier: string | null
          name: string
          owner_id: string
          phone: string | null
          rejection_reason: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          slug: string
          social_links: Json | null
          state: string | null
          tagline: string | null
          updated_at: string
          verification_tier_label: string | null
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
          hours?: string | null
          id?: string
          iec?: string | null
          is_hidden?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          languages?: string[]
          logo_url?: string | null
          markets?: string[]
          membership_tier?: string | null
          name: string
          owner_id: string
          phone?: string | null
          rejection_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slug: string
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          verification_tier_label?: string | null
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
          hours?: string | null
          id?: string
          iec?: string | null
          is_hidden?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          languages?: string[]
          logo_url?: string | null
          markets?: string[]
          membership_tier?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          rejection_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slug?: string
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          verification_tier_label?: string | null
          website?: string | null
        }
        Relationships: []
      }
      humor_posts: {
        Row: {
          attribution: string | null
          body: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          attribution?: string | null
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          attribution?: string | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_news: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          sort_order: number
          source_name: string | null
          source_url: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          source_name?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          source_name?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_signals: {
        Row: {
          analyst_note: string | null
          category: string | null
          commodity_name: string
          created_at: string
          demand: string
          id: string
          inquiries_week: number
          is_active: boolean
          origin: string | null
          price_max: number | null
          price_min: number | null
          requires_paid: boolean
          sort_order: number
          supply: string
          trend: string
          unit: string
          updated_at: string
        }
        Insert: {
          analyst_note?: string | null
          category?: string | null
          commodity_name: string
          created_at?: string
          demand?: string
          id?: string
          inquiries_week?: number
          is_active?: boolean
          origin?: string | null
          price_max?: number | null
          price_min?: number | null
          requires_paid?: boolean
          sort_order?: number
          supply?: string
          trend?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          analyst_note?: string | null
          category?: string | null
          commodity_name?: string
          created_at?: string
          demand?: string
          id?: string
          inquiries_week?: number
          is_active?: boolean
          origin?: string | null
          price_max?: number | null
          price_min?: number | null
          requires_paid?: boolean
          sort_order?: number
          supply?: string
          trend?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          body: string
          category: string
          created_at: string
          id: string
          is_pinned: boolean
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          body: string
          category?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          body?: string
          category?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          aliases: string[]
          created_at: string
          description: string | null
          emoji: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          is_hot: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_hot?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_hot?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
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
          b2c_url: string | null
          brand_id: string | null
          caliber: string | null
          category: string | null
          certifications: string[] | null
          company_id: string
          created_at: string
          description: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          inquiry_count: number
          inquiry_count_7d: number
          is_branded: boolean
          is_featured: boolean
          is_hidden: boolean
          lead_time_hours: number | null
          moisture: string | null
          name: string
          origin: string | null
          packaging_options: string[] | null
          price_max: number | null
          price_min: number | null
          retail_pack_size: string | null
          shelf_life: string | null
          slug: string
          stock_kg: number | null
          unit: string | null
          updated_at: string
          video_url: string | null
          view_count: number
        }
        Insert: {
          b2c_url?: string | null
          brand_id?: string | null
          caliber?: string | null
          category?: string | null
          certifications?: string[] | null
          company_id: string
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          inquiry_count?: number
          inquiry_count_7d?: number
          is_branded?: boolean
          is_featured?: boolean
          is_hidden?: boolean
          lead_time_hours?: number | null
          moisture?: string | null
          name: string
          origin?: string | null
          packaging_options?: string[] | null
          price_max?: number | null
          price_min?: number | null
          retail_pack_size?: string | null
          shelf_life?: string | null
          slug: string
          stock_kg?: number | null
          unit?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Update: {
          b2c_url?: string | null
          brand_id?: string | null
          caliber?: string | null
          category?: string | null
          certifications?: string[] | null
          company_id?: string
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          inquiry_count?: number
          inquiry_count_7d?: number
          is_branded?: boolean
          is_featured?: boolean
          is_hidden?: boolean
          lead_time_hours?: number | null
          moisture?: string | null
          name?: string
          origin?: string | null
          packaging_options?: string[] | null
          price_max?: number | null
          price_min?: number | null
          retail_pack_size?: string | null
          shelf_life?: string | null
          slug?: string
          stock_kg?: number | null
          unit?: string | null
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
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
      companies_public: {
        Row: {
          address: string | null
          categories: string[] | null
          certifications: string[] | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          established_year: number | null
          id: string | null
          is_hidden: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          membership_tier: string | null
          name: string | null
          owner_id: string | null
          review_status: Database["public"]["Enums"]["review_status"] | null
          slug: string | null
          social_links: Json | null
          state: string | null
          tagline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          membership_tier?: string | null
          name?: string | null
          owner_id?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          slug?: string | null
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          id?: string | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          membership_tier?: string | null
          name?: string | null
          owner_id?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          slug?: string | null
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
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
      downgrade_to_free: { Args: { _user_id: string }; Returns: undefined }
      get_buyer_reputation_tier: { Args: { _score: number }; Returns: string }
      get_company_contact_admin: {
        Args: { _company_id: string }
        Returns: {
          email: string
          gstin: string
          phone: string
        }[]
      }
      get_my_company: {
        Args: never
        Returns: {
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
          hours: string | null
          id: string
          iec: string | null
          is_hidden: boolean
          is_sponsored: boolean
          is_verified: boolean
          languages: string[]
          logo_url: string | null
          markets: string[]
          membership_tier: string | null
          name: string
          owner_id: string
          phone: string | null
          rejection_reason: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          slug: string
          social_links: Json | null
          state: string | null
          tagline: string | null
          updated_at: string
          verification_tier_label: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "companies"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      slugify: { Args: { _title: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "broker" | "paid_member" | "free_member"
      review_status: "pending" | "approved" | "rejected"
      rfq_status:
        | "new"
        | "viewed"
        | "responded"
        | "negotiating"
        | "converted"
        | "closed"
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
      review_status: ["pending", "approved", "rejected"],
      rfq_status: [
        "new",
        "viewed",
        "responded",
        "negotiating",
        "converted",
        "closed",
      ],
      verification_tier: ["unverified", "email", "company", "gst"],
    },
  },
} as const
