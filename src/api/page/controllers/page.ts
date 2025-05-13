// Datei: src/api/page/controllers/page.ts
import { factories } from '@strapi/strapi';
import { getCache, setCache, invalidateCache } from '../../../utils/caching';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      // Fehlerbehandlung für Redis
      const cachedPage = await getCache(`page:${id}`).catch(() => null);  // Wenn Redis fehlschlägt, gebe null zurück

      if (cachedPage) {
        return ctx.send(cachedPage);
      }

      // Hole die Seite aus der Datenbank
      const page = await strapi.db.query('api::page.page').findOne({
        where: { id },
        populate: ['text_paragraphs', 'images'],
      });

      if (!page) {
        return ctx.notFound('Seite nicht gefunden');
      }

      // Dynamische TTL basierend auf bestimmten Bedingungen
      const expirationTime = page.isImportant !== undefined && page.isImportant ? 1800 : 3600;

      // Speichere den Seiteninhalt im Cache mit der dynamischen TTL
      await setCache(`page:${id}`, page, expirationTime);

      return ctx.send(page); 
    } catch (error) {
      console.error(error);
      return ctx.internalServerError('Ein Fehler ist aufgetreten');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;

      // Cache löschen, wenn Seite aktualisiert wurde
      await invalidateCache(`page:${id}`);

      return await super.update(ctx);
    } catch (error) {
      return ctx.internalServerError('Fehler beim Aktualisieren der Seite');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;

      // Cache löschen, wenn Seite gelöscht wurde
      await invalidateCache(`page:${id}`);

      return await super.delete(ctx);
    } catch (error) {
      return ctx.internalServerError('Fehler beim Löschen der Seite');
    }
  },
}));
