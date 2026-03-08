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
      departments: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address_line: string | null
          city: string | null
          created_at: string | null
          department_id: string | null
          employee_number: string
          employment_status: string | null
          federal_tax_rate: number
          first_name: string | null
          hire_date: string
          id: string
          last_name: string | null
          pay_frequency: string
          pay_rate: number
          phone: string | null
          position: string
          "profile.id": string | null
          role: string | null
          social_security_tax_rate: number
          state: string | null
          state_tax_rate: number
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          created_at?: string | null
          department_id?: string | null
          employee_number: string
          employment_status?: string | null
          federal_tax_rate?: number
          first_name?: string | null
          hire_date: string
          id?: string
          last_name?: string | null
          pay_frequency: string
          pay_rate: number
          phone?: string | null
          position: string
          "profile.id"?: string | null
          role?: string | null
          social_security_tax_rate?: number
          state?: string | null
          state_tax_rate?: number
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line?: string | null
          city?: string | null
          created_at?: string | null
          department_id?: string | null
          employee_number?: string
          employment_status?: string | null
          federal_tax_rate?: number
          first_name?: string | null
          hire_date?: string
          id?: string
          last_name?: string | null
          pay_frequency?: string
          pay_rate?: number
          phone?: string | null
          position?: string
          "profile.id"?: string | null
          role?: string | null
          social_security_tax_rate?: number
          state?: string | null
          state_tax_rate?: number
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile.id_fkey"
            columns: ["profile.id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          created_at: string | null
          employee_id: string | null
          federal_tax: number | null
          gross_pay: number
          id: string
          net_pay: number
          overtime_hours: number | null
          payroll_run_id: string | null
          regular_hours: number | null
          social_security: number | null
          state_tax: number | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          federal_tax?: number | null
          gross_pay: number
          id?: string
          net_pay: number
          overtime_hours?: number | null
          payroll_run_id?: string | null
          regular_hours?: number | null
          social_security?: number | null
          state_tax?: number | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          federal_tax?: number | null
          gross_pay?: number
          id?: string
          net_pay?: number
          overtime_hours?: number | null
          payroll_run_id?: string | null
          regular_hours?: number | null
          social_security?: number | null
          state_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_payroll_run_id_fkey"
            columns: ["payroll_run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_runs: {
        Row: {
          created_at: string | null
          id: string
          pay_period_end: string
          pay_period_start: string
          run_by: string | null
          run_date: string | null
          status: string | null
          total_gross: number | null
          total_net: number | null
          total_taxes: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pay_period_end: string
          pay_period_start: string
          run_by?: string | null
          run_date?: string | null
          status?: string | null
          total_gross?: number | null
          total_net?: number | null
          total_taxes?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pay_period_end?: string
          pay_period_start?: string
          run_by?: string | null
          run_date?: string | null
          status?: string | null
          total_gross?: number | null
          total_net?: number | null
          total_taxes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_runs_run_by_fkey"
            columns: ["run_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          employee_id: string | null
          hours_worked: number
          id: string
          status: string | null
          work_date: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          hours_worked: number
          id?: string
          status?: string | null
          work_date?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          hours_worked?: number
          id?: string
          status?: string | null
          work_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
