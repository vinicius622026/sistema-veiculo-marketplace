// src/services/searchService.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const searchVeiculos = async (filters) => {
  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .match(filters);
  if (error) throw new Error(error.message);
  return data;
};

export const searchLojas = async (filters) => {
  const { data, error } = await supabase
    .from('lojas')
    .select('*')
    .match(filters);
  if (error) throw new Error(error.message);
  return data;
};

export const advancedSearch = async (veiculoFilters, lojaFilters) => {
  const veiculos = await searchVeiculos(veiculoFilters);
  const lojas = await searchLojas(lojaFilters);
  return { veiculos, lojas };
};

export const getFilterOptions = async () => {
  const { data: marcas, error: marcasError } = await supabase
    .from('veiculos')
    .select('marca');
  const { data: anos, error: anosError } = await supabase
    .from('veiculos')
    .select('ano');
  if (marcasError || anosError) throw new Error(marcasError.message || anosError.message);
  return { marcas, anos };
};

export const getPopularBrands = async () => {
  const { data, error } = await supabase
    .from('veiculos')
    .select('marca, count(*) as count')
    .group('marca')
    .order('count', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};