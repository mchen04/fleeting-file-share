// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://glmjbuikbvzmizbeiotk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWpidWlrYnZ6bWl6YmVpb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODQ5MTMsImV4cCI6MjA1MDg2MDkxM30.fbVXzOLouKnthyuRxXTGY2YCcG7FVdATYhoxTqAiq_A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);