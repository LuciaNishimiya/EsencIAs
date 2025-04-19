import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import path from 'path';
import fs from 'fs';
const dbFileName = 'database.sqlite';

const dbPath = path.resolve(dbFileName);
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
    console.error(`
❌ Error: ¡La base de datos no existe!

Para crear la base de datos y aplicar el esquema inicial, sigue estos pasos:

1. Para generar el esquema de la base de datos a partir del código, ejecuta:
   npm run db:generate

2. Para crear el archivo de base de datos y sincronizar el esquema, ejecuta:
   npm run db:push

Luego, inicia la aplicación de nuevo.

📌 Nota: Si se realizan cambios en el esquema ubicado en 'src/models/dbSchema/schema.js',
debes volver a ejecutar los mismos comandos para aplicar esos cambios en la base de datos.
`);
    process.exit(1);
}

const sqliteInstance = new Database(dbPath /*, { verbose: console.log } */);
export const db = drizzle(sqliteInstance, { schema });