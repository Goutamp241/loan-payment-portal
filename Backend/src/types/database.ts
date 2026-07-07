/**
 * Database row types matching Supabase schema.
 */

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          customer_id: string;
          full_name: string;
          mobile: string;
          card_last4: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      loan_accounts: {
        Row: {
          id: string;
          customer_id: string;
          total_due: number;
          minimum_due: number;
          due_date: string;
          processing_fee: number;
          convenience_fee: number;
          payment_status: 'pending' | 'paid' | 'none';
          last_updated: string;
        };
      };
      payment_sessions: {
        Row: {
          id: string;
          customer_id: string;
          reference_number: string;
          status: 'active' | 'completed' | 'expired' | 'failed';
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          reference_number: string;
          status?: string;
          expires_at: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          session_id: string | null;
          customer_id: string;
          amount: number;
          payment_option: string;
          external_txn_id: string | null;
          status: 'pending' | 'processing' | 'success' | 'failed';
          failure_reason: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

export type Customer = Database['public']['Tables']['customers']['Row'];
export type LoanAccount = Database['public']['Tables']['loan_accounts']['Row'];
export type PaymentSession = Database['public']['Tables']['payment_sessions']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
