const SUPABASE_URL =
"https://cvqpjzxxskaftngtvzjd.supabase.co";


const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cXBqenh4c2thZnRuZ3R2empkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODc1ODcsImV4cCI6MjA5NTQ2MzU4N30.8xR2QjASbAMqkylBwnCESTZS_CINYU8G-Me6s-nM1yM";


const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);