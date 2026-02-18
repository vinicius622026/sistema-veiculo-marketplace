'use strict';

// Jest setup file

// Mocking Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const mockSupabase = createClient(supabaseUrl, supabaseAnonKey);

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Additional setup can be added here
