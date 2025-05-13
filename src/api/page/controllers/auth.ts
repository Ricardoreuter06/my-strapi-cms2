import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'meinSuperSecretKey';

const generateJWT = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' }); // 1 Stunde Gültigkeit
};

export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body;

  // Benutzer mit dem angegebenen Benutzernamen suchen
  const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { username },  // Suche nach dem Benutzernamen
  });

  if (!user) {
    ctx.throw(400, 'Benutzer nicht gefunden');
    return;
  }

  // Passwort überprüfen
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    ctx.throw(400, 'Falsches Passwort');
    return;
  }

  // JWT erstellen
  const token = generateJWT(user.id);

  // JWT zurückgeben
  ctx.send({ token });
};

// Middleware zur Authentifizierung
export const authenticate = async (ctx: Context, next: () => Promise<any>) => {
  const token = ctx.request.headers['authorization'];

  if (!token) {
    ctx.throw(401, 'Kein Token gefunden');
    return;
  }

  try {
    // Entferne das "Bearer" Präfix und validiere das JWT
    const decoded: any = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

    // Benutzer-ID im Kontext speichern
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.throw(401, 'Ungültiger oder abgelaufener Token');
  }
};
