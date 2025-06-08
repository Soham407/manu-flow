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
      brands: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
          variants: string[] | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          variants?: string[] | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          variants?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string
          advance_deposit: number
          balance: number
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          is_hidden: boolean
        }
        Insert: {
          address: string
          advance_deposit?: number
          balance?: number
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          is_hidden?: boolean
        }
        Update: {
          address?: string
          advance_deposit?: number
          balance?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          is_hidden?: boolean
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          customer_name: string
          due_date: string
          id: string
          is_hidden: boolean
          order_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          customer_name: string
          due_date: string
          id?: string
          is_hidden?: boolean
          order_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          due_date?: string
          id?: string
          is_hidden?: boolean
          order_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          created_at: string
          current_order_id: string | null
          description: string
          estimated_free_time: string | null
          id: string
          name: string
          specifications: string | null
          status: Database["public"]["Enums"]["machine_status"]
          type: string
        }
        Insert: {
          created_at?: string
          current_order_id?: string | null
          description: string
          estimated_free_time?: string | null
          id?: string
          name: string
          specifications?: string | null
          status?: Database["public"]["Enums"]["machine_status"]
          type: string
        }
        Update: {
          created_at?: string
          current_order_id?: string | null
          description?: string
          estimated_free_time?: string | null
          id?: string
          name?: string
          specifications?: string | null
          status?: Database["public"]["Enums"]["machine_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_machines_current_order"
            columns: ["current_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          cost_per_meter: number
          created_at: string
          current_stock: number
          id: string
          last_updated: string
          min_stock_level: number
          name: string
          supplier: string | null
          type: string
          unit: string
        }
        Insert: {
          cost_per_meter?: number
          created_at?: string
          current_stock?: number
          id?: string
          last_updated?: string
          min_stock_level?: number
          name: string
          supplier?: string | null
          type: string
          unit?: string
        }
        Update: {
          cost_per_meter?: number
          created_at?: string
          current_stock?: number
          id?: string
          last_updated?: string
          min_stock_level?: number
          name?: string
          supplier?: string | null
          type?: string
          unit?: string
        }
        Relationships: []
      }
      order_machines: {
        Row: {
          created_at: string
          end_time: string | null
          estimated_hours: number
          id: string
          machine_id: string | null
          machine_name: string
          order_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["order_machine_status"]
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          estimated_hours: number
          id?: string
          machine_id?: string | null
          machine_name: string
          order_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["order_machine_status"]
        }
        Update: {
          created_at?: string
          end_time?: string | null
          estimated_hours?: number
          id?: string
          machine_id?: string | null
          machine_name?: string
          order_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["order_machine_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_machines_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_machines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          brand_name: string | null
          company_name: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          description: string
          estimated_delivery: string
          estimated_material_needed: number
          id: string
          is_hidden: boolean
          material_id: string | null
          material_used: number | null
          price_per_unit: number
          production_status:
            | Database["public"]["Enums"]["production_status"]
            | null
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          variant: string | null
        }
        Insert: {
          brand_name?: string | null
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          description: string
          estimated_delivery: string
          estimated_material_needed?: number
          id?: string
          is_hidden?: boolean
          material_id?: string | null
          material_used?: number | null
          price_per_unit: number
          production_status?:
            | Database["public"]["Enums"]["production_status"]
            | null
          quantity: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          variant?: string | null
        }
        Update: {
          brand_name?: string | null
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          description?: string
          estimated_delivery?: string
          estimated_material_needed?: number
          id?: string
          is_hidden?: boolean
          material_id?: string | null
          material_used?: number | null
          price_per_unit?: number
          production_status?:
            | Database["public"]["Enums"]["production_status"]
            | null
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          is_hidden: boolean
          method: Database["public"]["Enums"]["payment_method"]
          reference: string | null
          type: Database["public"]["Enums"]["payment_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          is_hidden?: boolean
          method?: Database["public"]["Enums"]["payment_method"]
          reference?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          is_hidden?: boolean
          method?: Database["public"]["Enums"]["payment_method"]
          reference?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      production_jobs: {
        Row: {
          actual_hours: number | null
          completed_at: string | null
          created_at: string
          description: string
          estimated_hours: number
          id: string
          order_id: string | null
          priority: Database["public"]["Enums"]["job_priority"]
          status: Database["public"]["Enums"]["job_status"]
          title: string
        }
        Insert: {
          actual_hours?: number | null
          completed_at?: string | null
          created_at?: string
          description: string
          estimated_hours: number
          id?: string
          order_id?: string | null
          priority?: Database["public"]["Enums"]["job_priority"]
          status?: Database["public"]["Enums"]["job_status"]
          title: string
        }
        Update: {
          actual_hours?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string
          estimated_hours?: number
          id?: string
          order_id?: string | null
          priority?: Database["public"]["Enums"]["job_priority"]
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_steps: {
        Row: {
          actual_hours: number | null
          assigned_worker_id: string | null
          assigned_worker_name: string | null
          completed_at: string | null
          created_at: string
          description: string
          estimated_hours: number
          id: string
          job_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["step_status"]
          title: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_worker_id?: string | null
          assigned_worker_name?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          estimated_hours: number
          id?: string
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["step_status"]
          title: string
        }
        Update: {
          actual_hours?: number | null
          assigned_worker_id?: string | null
          assigned_worker_name?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          estimated_hours?: number
          id?: string
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["step_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_steps_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_steps_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "production_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          customer_name: string | null
          description: string
          id: string
          is_hidden: boolean
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          description: string
          id?: string
          is_hidden?: boolean
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          description?: string
          id?: string
          is_hidden?: boolean
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
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
      invoice_status: "pending" | "paid" | "partial" | "overdue"
      job_priority: "low" | "medium" | "high"
      job_status: "created" | "in_progress" | "completed" | "on_hold"
      machine_status: "free" | "occupied" | "maintenance"
      order_machine_status: "scheduled" | "running" | "completed"
      order_status: "pending" | "in_production" | "completed" | "dispatched"
      payment_method: "cash" | "bank_transfer" | "cheque" | "online"
      payment_type: "advance" | "invoice_payment" | "deposit"
      production_status: "start" | "waiting" | "done"
      step_status: "pending" | "in_progress" | "completed" | "blocked"
      transaction_type: "payment" | "invoice" | "order"
      user_role:
        | "super_admin"
        | "admin"
        | "accounts"
        | "production_manager"
        | "dispatch"
        | "worker"
        | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invoice_status: ["pending", "paid", "partial", "overdue"],
      job_priority: ["low", "medium", "high"],
      job_status: ["created", "in_progress", "completed", "on_hold"],
      machine_status: ["free", "occupied", "maintenance"],
      order_machine_status: ["scheduled", "running", "completed"],
      order_status: ["pending", "in_production", "completed", "dispatched"],
      payment_method: ["cash", "bank_transfer", "cheque", "online"],
      payment_type: ["advance", "invoice_payment", "deposit"],
      production_status: ["start", "waiting", "done"],
      step_status: ["pending", "in_progress", "completed", "blocked"],
      transaction_type: ["payment", "invoice", "order"],
      user_role: [
        "super_admin",
        "admin",
        "accounts",
        "production_manager",
        "dispatch",
        "worker",
        "customer",
      ],
    },
  },
} as const
