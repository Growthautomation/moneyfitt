export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          advisor_id: string | null
          client_id: string | null
          created_at: string
          id: number
          message: string | null
          output: string | null
          prompt: string | null
        }
        Insert: {
          advisor_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: number
          message?: string | null
          output?: string | null
          prompt?: string | null
        }
        Update: {
          advisor_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: number
          message?: string | null
          output?: string | null
          prompt?: string | null
        }
        Relationships: []
      }
      advisor: {
        Row: {
          active: boolean | null
          age_group: string | null
          agency_website: string | null
          awards: Json | null
          bio: string | null
          broad_scope: Json | null
          certifications: Json | null
          created_at: string
          current_company: string | null
          education: Json | null
          first_name: string | null
          gender: string | null
          id: string
          languages: Json | null
          last_name: string | null
          mas: string | null
          narrow_scope: Json | null
          personal_interests: Json | null
          personal_website: string | null
          professional_background: Json | null
          profile_img: string | null
          religion: string | null
          secondary_images: Json | null
          social_profiles: Json | null
          tagline: string | null
          testinomial: Json | null
          title: string | null
        }
        Insert: {
          active?: boolean | null
          age_group?: string | null
          agency_website?: string | null
          awards?: Json | null
          bio?: string | null
          broad_scope?: Json | null
          certifications?: Json | null
          created_at?: string
          current_company?: string | null
          education?: Json | null
          first_name?: string | null
          gender?: string | null
          id?: string
          languages?: Json | null
          last_name?: string | null
          mas?: string | null
          narrow_scope?: Json | null
          personal_interests?: Json | null
          personal_website?: string | null
          professional_background?: Json | null
          profile_img?: string | null
          religion?: string | null
          secondary_images?: Json | null
          social_profiles?: Json | null
          tagline?: string | null
          testinomial?: Json | null
          title?: string | null
        }
        Update: {
          active?: boolean | null
          age_group?: string | null
          agency_website?: string | null
          awards?: Json | null
          bio?: string | null
          broad_scope?: Json | null
          certifications?: Json | null
          created_at?: string
          current_company?: string | null
          education?: Json | null
          first_name?: string | null
          gender?: string | null
          id?: string
          languages?: Json | null
          last_name?: string | null
          mas?: string | null
          narrow_scope?: Json | null
          personal_interests?: Json | null
          personal_website?: string | null
          professional_background?: Json | null
          profile_img?: string | null
          religion?: string | null
          secondary_images?: Json | null
          social_profiles?: Json | null
          tagline?: string | null
          testinomial?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      chat_suggestion: {
        Row: {
          advisor_id: string
          client_id: string
          created_at: string
          id: string
          last_message_id: string | null
          suggestions: Json[] | null
        }
        Insert: {
          advisor_id?: string
          client_id?: string
          created_at?: string
          id?: string
          last_message_id?: string | null
          suggestions?: Json[] | null
        }
        Update: {
          advisor_id?: string
          client_id?: string
          created_at?: string
          id?: string
          last_message_id?: string | null
          suggestions?: Json[] | null
        }
        Relationships: []
      }
      client: {
        Row: {
          all_answers: Json | null
          broad_scope: Json | null
          contents: Json[] | null
          created_at: string
          id: string
          is_admin: boolean | null
          name: string | null
          narrow_scope: Json | null
          phone_number: string | null
          preferred_advisor: Json | null
          preferred_age_group: Json | null
          preferred_contact_email: string | null
          preferred_language: Json | null
          preferred_religion: Json | null
          preferred_sex: Json | null
          telegram: string | null
        }
        Insert: {
          all_answers?: Json | null
          broad_scope?: Json | null
          contents?: Json[] | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          narrow_scope?: Json | null
          phone_number?: string | null
          preferred_advisor?: Json | null
          preferred_age_group?: Json | null
          preferred_contact_email?: string | null
          preferred_language?: Json | null
          preferred_religion?: Json | null
          preferred_sex?: Json | null
          telegram?: string | null
        }
        Update: {
          all_answers?: Json | null
          broad_scope?: Json | null
          contents?: Json[] | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          narrow_scope?: Json | null
          phone_number?: string | null
          preferred_advisor?: Json | null
          preferred_age_group?: Json | null
          preferred_contact_email?: string | null
          preferred_language?: Json | null
          preferred_religion?: Json | null
          preferred_sex?: Json | null
          telegram?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          created_at: string
          id: number
          message: string | null
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          advisor_id: string
          client_id: string
          created_at: string | null
          id: string
          last_message_id: string | null
          summary: Json
        }
        Insert: {
          advisor_id: string
          client_id: string
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          summary: Json
        }
        Update: {
          advisor_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          summary?: Json
        }
        Relationships: []
      }
      matchings: {
        Row: {
          advisor_id: string | null
          advisor_visibility: Json | null
          client_id: string | null
          created_at: string
          enabled: boolean | null
          id: number
          need_score: number | null
          personal_score: number | null
          total_score: number | null
        }
        Insert: {
          advisor_id?: string | null
          advisor_visibility?: Json | null
          client_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: number
          need_score?: number | null
          personal_score?: number | null
          total_score?: number | null
        }
        Update: {
          advisor_id?: string | null
          advisor_visibility?: Json | null
          client_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: number
          need_score?: number | null
          personal_score?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matchings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          files: Json | null
          id: string
          is_read: boolean | null
          message: string
          recipient: string
          sender: string
        }
        Insert: {
          created_at?: string | null
          files?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          recipient?: string
          sender?: string
        }
        Update: {
          created_at?: string | null
          files?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          recipient?: string
          sender?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
