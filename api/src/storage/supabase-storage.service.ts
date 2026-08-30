import { Injectable } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'node:path';

const BUCKET = 'productos';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }

  async upload(slugPrefix: string, file: Express.Multer.File): Promise<string> {
    const path = `${slugPrefix}-${Date.now()}${extname(file.originalname)}`;
    const { error } = await this.client.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw error;
    return this.client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  /** No-op si la URL no pertenece al bucket (no debería pasar, pero evita romper el borrado de la fila si pasa). */
  async remove(publicUrl: string): Promise<void> {
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.slice(idx + marker.length);
    await this.client.storage.from(BUCKET).remove([path]);
  }
}
