/* page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async findOne(ctx) {
    try {
      // Hole die ID aus den Parametern
      const { id } = ctx.params;

      // Die Methode "findOne" holt den einzelnen Datensatz
      const page = await strapi.db.query('api::page.page').findOne({
        where: { id },  // Suche nach dem Datensatz mit der übergebenen ID
        populate: ['text_paragraphs', 'images'],  // Sicherstellen, dass die Bilder und Textabschnitte mitgeladen werden
      });

      if (!page) {
        return ctx.notFound('Seite nicht gefunden');  // Seite nicht gefunden, Fehlerbehandlung
      }

      return ctx.send(page);  // Erfolgreiche Antwort zurückgeben
    } catch (error) {
      console.error(error);
      return ctx.internalServerError('Ein Fehler ist aufgetreten');
    }
  },
}));
