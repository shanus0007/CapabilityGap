import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewikbjvxapvgqwivuuhc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aWtianZ4YXB2Z3F3aXZ1dWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDYzOTksImV4cCI6MjA4OTk4MjM5OX0.r1ha6wE8Uh_MVwdQ5GWJTjl4L3wLB3LSIjvSq_qNxYw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
