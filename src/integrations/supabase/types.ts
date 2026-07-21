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
      anonymous_identity_log: {
        Row: {
          created_at: string
          id: string
          post_id: string
          real_author_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          real_author_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          real_author_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_identity_log_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
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
          attachments: Json
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
          attachments?: Json
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
          attachments?: Json
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
      community_posts: {
        Row: {
          anonymous_expires_at: string | null
          author_id: string
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          is_hidden: boolean
          is_pinned: boolean
          post_type: string
          structured_data: Json | null
          topic_tag: string | null
          updated_at: string
        }
        Insert: {
          anonymous_expires_at?: string | null
          author_id: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          is_hidden?: boolean
          is_pinned?: boolean
          post_type?: string
          structured_data?: Json | null
          topic_tag?: string | null
          updated_at?: string
        }
        Update: {
          anonymous_expires_at?: string | null
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          is_hidden?: boolean
          is_pinned?: boolean
          post_type?: string
          structured_data?: Json | null
          topic_tag?: string | null
          updated_at?: string
        }
        Relationships: []
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
          fssai: string | null
          gstin: string | null
          hours: string | null
          id: string
          iec: string | null
          is_hidden: boolean
          is_sponsored: boolean
          is_verified: boolean
          languages: string[]
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          markets: string[]
          membership_tier: string | null
          name: string
          owner_id: string
          phone: string | null
          pincode: string | null
          place_id: string | null
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
          fssai?: string | null
          gstin?: string | null
          hours?: string | null
          id?: string
          iec?: string | null
          is_hidden?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          languages?: string[]
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          markets?: string[]
          membership_tier?: string | null
          name: string
          owner_id: string
          phone?: string | null
          pincode?: string | null
          place_id?: string | null
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
          fssai?: string | null
          gstin?: string | null
          hours?: string | null
          id?: string
          iec?: string | null
          is_hidden?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          languages?: string[]
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          markets?: string[]
          membership_tier?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          pincode?: string | null
          place_id?: string | null
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
      deal_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          room_id: string
          sender_company_id: string
          sender_user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          room_id: string
          sender_company_id: string
          sender_user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          room_id?: string
          sender_company_id?: string
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_messages_sender_company_id_fkey"
            columns: ["sender_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_messages_sender_company_id_fkey"
            columns: ["sender_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_rooms: {
        Row: {
          context_type: string
          counterparty_company_id: string
          created_at: string
          created_by: string | null
          id: string
          initiator_company_id: string
          last_message_at: string
          product_id: string | null
          quotation_id: string | null
          rfq_id: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          context_type?: string
          counterparty_company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          initiator_company_id: string
          last_message_at?: string
          product_id?: string | null
          quotation_id?: string | null
          rfq_id?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          context_type?: string
          counterparty_company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          initiator_company_id?: string
          last_message_at?: string
          product_id?: string | null
          quotation_id?: string | null
          rfq_id?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_rooms_counterparty_company_id_fkey"
            columns: ["counterparty_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_counterparty_company_id_fkey"
            columns: ["counterparty_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_initiator_company_id_fkey"
            columns: ["initiator_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_initiator_company_id_fkey"
            columns: ["initiator_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "rfq_quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfq_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          followed_company_id: string
          follower_user_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followed_company_id: string
          follower_user_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followed_company_id?: string
          follower_user_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_company_id_fkey"
            columns: ["followed_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_followed_company_id_fkey"
            columns: ["followed_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
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
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_hidden: boolean
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_poll_options: {
        Row: {
          id: string
          idx: number
          label: string
          poll_id: string
        }
        Insert: {
          id?: string
          idx: number
          label: string
          poll_id: string
        }
        Update: {
          id?: string
          idx?: number
          label?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "post_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_poll_votes: {
        Row: {
          created_at: string
          option_id: string
          poll_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          option_id: string
          poll_id: string
          voter_id: string
        }
        Update: {
          created_at?: string
          option_id?: string
          poll_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "post_poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "post_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_polls: {
        Row: {
          closes_at: string
          created_at: string
          id: string
          post_id: string
          question: string
        }
        Insert: {
          closes_at: string
          created_at?: string
          id?: string
          post_id: string
          question: string
        }
        Update: {
          closes_at?: string
          created_at?: string
          id?: string
          post_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          id: string
          post_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
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
          is_muted: boolean
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
          is_muted?: boolean
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
          is_muted?: boolean
          phone?: string | null
          rfq_count?: number
          rfq_response_rate?: number
          updated_at?: string
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
        }
        Relationships: []
      }
      rfq_contact_reveals: {
        Row: {
          id: string
          revealed_at: string
          rfq_id: string
          user_id: string
        }
        Insert: {
          id?: string
          revealed_at?: string
          rfq_id: string
          user_id: string
        }
        Update: {
          id?: string
          revealed_at?: string
          rfq_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_contact_reveals_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfq_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_listings: {
        Row: {
          commodity: string
          company_id: string | null
          created_at: string
          currency: string
          delivery_location: string | null
          grade_variety: string | null
          id: string
          is_hidden: boolean
          listing_type: string
          notes: string | null
          origin_country: string | null
          packaging: string | null
          posted_by: string
          price_max: number
          price_min: number
          price_unit: string
          quantity_max: number
          quantity_min: number
          quantity_unit: string
          status: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          commodity: string
          company_id?: string | null
          created_at?: string
          currency?: string
          delivery_location?: string | null
          grade_variety?: string | null
          id?: string
          is_hidden?: boolean
          listing_type: string
          notes?: string | null
          origin_country?: string | null
          packaging?: string | null
          posted_by: string
          price_max: number
          price_min: number
          price_unit: string
          quantity_max: number
          quantity_min: number
          quantity_unit: string
          status?: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          commodity?: string
          company_id?: string | null
          created_at?: string
          currency?: string
          delivery_location?: string | null
          grade_variety?: string | null
          id?: string
          is_hidden?: boolean
          listing_type?: string
          notes?: string | null
          origin_country?: string | null
          packaging?: string | null
          posted_by?: string
          price_max?: number
          price_min?: number
          price_unit?: string
          quantity_max?: number
          quantity_min?: number
          quantity_unit?: string
          status?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_quotations: {
        Row: {
          created_at: string
          currency: string
          delivery_terms: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          price_max: number
          price_min: number
          price_unit: string
          quantity_max: number
          quantity_min: number
          quantity_unit: string
          quote_kind: string
          recipient_company_id: string
          rfq_id: string
          sender_company_id: string
          sender_user_id: string
          status: string
          updated_at: string
          valid_until: string
          version: number
        }
        Insert: {
          created_at?: string
          currency?: string
          delivery_terms?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          price_max: number
          price_min: number
          price_unit: string
          quantity_max: number
          quantity_min: number
          quantity_unit: string
          quote_kind?: string
          recipient_company_id: string
          rfq_id: string
          sender_company_id: string
          sender_user_id: string
          status?: string
          updated_at?: string
          valid_until: string
          version?: number
        }
        Update: {
          created_at?: string
          currency?: string
          delivery_terms?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          price_max?: number
          price_min?: number
          price_unit?: string
          quantity_max?: number
          quantity_min?: number
          quantity_unit?: string
          quote_kind?: string
          recipient_company_id?: string
          rfq_id?: string
          sender_company_id?: string
          sender_user_id?: string
          status?: string
          updated_at?: string
          valid_until?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "rfq_quotations_recipient_company_id_fkey"
            columns: ["recipient_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_quotations_recipient_company_id_fkey"
            columns: ["recipient_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_quotations_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfq_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_quotations_sender_company_id_fkey"
            columns: ["sender_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_quotations_sender_company_id_fkey"
            columns: ["sender_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
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
      companies_public: {
        Row: {
          categories: string[] | null
          certifications: string[] | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          established_year: number | null
          hours: string | null
          id: string | null
          is_hidden: boolean | null
          is_sponsored: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          logo_url: string | null
          markets: string[] | null
          membership_tier: string | null
          name: string | null
          owner_id: string | null
          review_status: Database["public"]["Enums"]["review_status"] | null
          slug: string | null
          social_links: Json | null
          state: string | null
          tagline: string | null
          updated_at: string | null
          verification_tier_label: string | null
          website: string | null
        }
        Insert: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          hours?: string | null
          id?: string | null
          is_hidden?: boolean | null
          is_sponsored?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          markets?: string[] | null
          membership_tier?: string | null
          name?: string | null
          owner_id?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          slug?: string | null
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string | null
          verification_tier_label?: string | null
          website?: string | null
        }
        Update: {
          categories?: string[] | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          hours?: string | null
          id?: string | null
          is_hidden?: boolean | null
          is_sponsored?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          logo_url?: string | null
          markets?: string[] | null
          membership_tier?: string | null
          name?: string | null
          owner_id?: string | null
          review_status?: Database["public"]["Enums"]["review_status"] | null
          slug?: string | null
          social_links?: Json | null
          state?: string | null
          tagline?: string | null
          updated_at?: string | null
          verification_tier_label?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_business_comment: {
        Args: { _content: string; _post_id: string }
        Returns: string
      }
      can_access_deal_room: { Args: { _room_id: string }; Returns: boolean }
      cast_business_poll_vote: {
        Args: { _option_id: string; _poll_id: string }
        Returns: string
      }
      create_business_poll_post: {
        Args: {
          _content?: string
          _duration_days?: number
          _options: string[]
          _question: string
          _structured_data?: Json
        }
        Returns: string
      }
      create_business_post: {
        Args: { _content?: string; _post_type: string; _structured_data?: Json }
        Returns: string
      }
      downgrade_to_free: { Args: { _user_id: string }; Returns: undefined }
      get_business_poll: {
        Args: { _post_id: string }
        Returns: {
          closes_at: string
          option_id: string
          option_index: number
          option_label: string
          poll_id: string
          post_id: string
          question: string
          vote_count: number
          voted: boolean
        }[]
      }
      get_business_post_engagement: {
        Args: { _ids: string[] }
        Returns: {
          comment_count: number
          like_count: number
          liked: boolean
          post_id: string
          view_count: number
        }[]
      }
      get_buyer_reputation_tier: { Args: { _score: number }; Returns: string }
      get_company_contact_admin: {
        Args: { _company_id: string }
        Returns: {
          email: string
          gstin: string
          phone: string
        }[]
      }
      get_company_whatsapp: { Args: { _company_id: string }; Returns: string }
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
          fssai: string | null
          gstin: string | null
          hours: string | null
          id: string
          iec: string | null
          is_hidden: boolean
          is_sponsored: boolean
          is_verified: boolean
          languages: string[]
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          markets: string[]
          membership_tier: string | null
          name: string
          owner_id: string
          phone: string | null
          pincode: string | null
          place_id: string | null
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
      get_post_like_summary: {
        Args: { _ids: string[] }
        Returns: {
          like_count: number
          liked: boolean
          post_id: string
        }[]
      }
      get_post_view_summary: {
        Args: { _ids: string[] }
        Returns: {
          post_id: string
          view_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_verified_business: { Args: never; Returns: boolean }
      is_features_open: { Args: never; Returns: boolean }
      is_free_within_grace: { Args: { _uid: string }; Returns: boolean }
      is_muted: { Args: { _uid: string }; Returns: boolean }
      is_paid_or_admin: { Args: { _uid: string }; Returns: boolean }
      record_business_post_view: {
        Args: { _post_id: string }
        Returns: undefined
      }
      send_deal_message: {
        Args: { _body: string; _room_id: string }
        Returns: string
      }
      set_business_post_like: {
        Args: { _liked: boolean; _post_id: string }
        Returns: boolean
      }
      slugify: { Args: { _title: string }; Returns: string }
      start_deal_room: {
        Args: {
          _context_type?: string
          _counterparty_company_id: string
          _product_id?: string
          _quotation_id?: string
          _rfq_id?: string
          _subject: string
        }
        Returns: string
      }
      withdraw_my_rfq_quotation: {
        Args: { _quotation_id: string }
        Returns: boolean
      }
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
