import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BUCKET = process.env.SUPABASE_BUCKET;

export async function uploadBookFile(fileBuffer, fileName, mimetype) {
  const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, fileBuffer, {
    contentType: mimetype,
    upsert: true,
  });
  if (error) throw new Error('Supabase upload error: ' + error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
}
