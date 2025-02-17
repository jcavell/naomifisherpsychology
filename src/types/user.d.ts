export type User = {
  id?: bigint; // Primary key, optional for inserts
  created_at?: string; // Timestamp, optional as it defaults to `now()`
  first_name: string;
  surname: string;
  email: string; // Non-null and unique
  stripe_customer_id?: string; // Nullable field
  kajabi_customer_id?: string; // Nullable field
  eb_subscriber_id?: string; // Nullable field
  kit_subscriber_id?: string; // Nullable field
  subscribed_to_marketing?: boolean; // Nullable field with a default of `false`
};
