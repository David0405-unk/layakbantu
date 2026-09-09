import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jyjsieudhmsfazfbsger.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5anNpZXVkaG1zZmF6ZmJzZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTM5MjYsImV4cCI6MjEwNDA4OTkyNn0.hxMVAluxym6c7hdG3UjjtC0hedQeY4qstBwLI9U0Pfo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;