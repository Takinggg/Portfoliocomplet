// Supabase Project Configuration
// Ces valeurs doivent correspondre à votre projet Supabase

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'ptcxeqtjlxittxayffgu';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc';

// Base URL for API calls
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
