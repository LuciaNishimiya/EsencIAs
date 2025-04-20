import { GoogleGenAI, Type } from '@google/genai';
export {Type} 
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Genera contenido utilizando el modelo de IA.
 * @param {string} model - El modelo a utilizar.
 * @param {Array} contents - Los contenidos a procesar.
 * @param {Object} config - Configuración adicional para la solicitud.
 * @returns {Object} La respuesta del modelo de IA.
 */
export async function gen({ model, contents, config, functions }) {
    const response = await ai.models.generateContent({
        model,
        contents,
        config,
    });

    handleFunctionCalls(response, functions);
    return response.text;
}

/**
 * Maneja las llamadas a funciones desde la respuesta de la IA.
 * @param {Object} response - La respuesta del modelo de IA.
 */
async function handleFunctionCalls(response, functions) {
    if (response.functionCalls && response.functionCalls.length > 0) {
        for (const functionCall of response.functionCalls) {
            const { name, args } = functionCall;

            // Verifica si la función existe en el objeto `functions`
            if (functions[name]) {
                try {
                    // Llama a la función con los argumentos proporcionados
                    await functions[name](args);
                } catch (error) {
                    console.error(`Error al ejecutar la función "${name}":`, error);
                }
            } else {
                console.warn(`La función "${name}" no está definida en el objeto de funciones.`);
            }
        }
    }
}
