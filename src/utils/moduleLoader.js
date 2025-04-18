import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Carga automáticamente módulos y ejecuta sus funciones exportadas con los argumentos dados.
 * @param {string} relativeDirectory - Carpeta desde la raíz del proyecto (ej. '/events')
 * @param {object} context - Objeto que se pasará a cada función exportada
 * @returns {Promise<Array>} Lista de resultados retornados por cada función cargada
 */
export async function loadModules(relativeDirectory, context = {}) {
    const baseDir = path.dirname(fileURLToPath(import.meta.url));
    const fullPath = path.join(baseDir, '..', relativeDirectory);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ No existe el directorio: ${fullPath}`);
        return [];
    }

    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.js'));
    const results = [];

    for (const file of files) {
        const filePath = path.join(fullPath, file);
        const fileUrl = pathToFileURL(filePath).href;

        try {
            const mod = await import(fileUrl);
            const entries = Object.entries(mod);

            if (entries.length === 0) {
                console.warn(`❌ El archivo "${file}" no exporta nada.`);
                continue;
            }

            for (const [name, fn] of entries) {
                if (typeof fn !== 'function') {
                    console.warn(`⚠️ "${name}" en "${file}" no es una función.`);
                    continue;
                }

                console.log(`✅ ${relativeDirectory} módulo "${file}" cargado correctamente`);
                const result = await fn(context);
               
                    results.push({ name, result });
                
            }
        } catch (err) {
            console.error(`❌ Error al importar "${file}":`, err);
        }
    }

    return results;
}
