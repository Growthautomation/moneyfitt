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
      advisor: {
        Row: {
          age_group: string | null
          agency_website: string | null
          awards: Json | null
          bio: string | null
          broad_scope: Json | null
          certifications: Json | null
          created_at: string
          current_company: string | null
          education: string | null
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
          religion: string | null
          social_profiles: Json | null
          testinomial: Json | null
          title: string | null
        }
        Insert: {
          age_group?: string | null
          agency_website?: string | null
          awards?: Json | null
          bio?: string | null
          broad_scope?: Json | null
          certifications?: Json | null
          created_at?: string
          current_company?: string | null
          education?: string | null
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
          religion?: string | null
          social_profiles?: Json | null
          testinomial?: Json | null
          title?: string | null
        }
        Update: {
          age_group?: string | null
          agency_website?: string | null
          awards?: Json | null
          bio?: string | null
          broad_scope?: Json | null
          certifications?: Json | null
          created_at?: string
          current_company?: string | null
          education?: string | null
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
          religion?: string | null
          social_profiles?: Json | null
          testinomial?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      client: {
        Row: {
          all_answers: Json | null
          broad_scope: Json | null
          created_at: string
          id: string
          name: string | null
          narrow_scope: Json | null
          preferred_advisor: Json | null
          preferred_age_group: Json | null
          preferred_language: Json | null
          preferred_religion: Json | null
          preferred_sex: Json | null
        }
        Insert: {
          all_answers?: Json | null
          broad_scope?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          narrow_scope?: Json | null
          preferred_advisor?: Json | null
          preferred_age_group?: Json | null
          preferred_language?: Json | null
          preferred_religion?: Json | null
          preferred_sex?: Json | null
        }
        Update: {
          all_answers?: Json | null
          broad_scope?: Json | null
          created_at?: string
          id?: string
          name?: string | null
          narrow_scope?: Json | null
          preferred_advisor?: Json | null
          preferred_age_group?: Json | null
          preferred_language?: Json | null
          preferred_religion?: Json | null
          preferred_sex?: Json | null
        }
        Relationships: []
      }
      matchings: {
        Row: {
          advisor_id: string | null
          client_id: string | null
          created_at: string
          enabled: boolean | null
          id: number
        }
        Insert: {
          advisor_id?: string | null
          client_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: number
        }
        Update: {
          advisor_id?: string | null
          client_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          files: Json | null
          id: string
          message: string
          recipient: string
          sender: string
        }
        Insert: {
          created_at?: string | null
          files?: Json | null
          id?: string
          message: string
          recipient?: string
          sender?: string
        }
        Update: {
          created_at?: string | null
          files?: Json | null
          id?: string
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
