import { text, real, integer, foreignKey, sqliteTable as table, primaryKey } from "drizzle-orm/sqlite-core";

/**
 * Tabla de usuarios.
 * Representa un usuario único dentro de un servidor específico en Discord.
 */
export const user = table(
    "user",
    {
        id: text("id").notNull(),               // ID global del usuario (por ejemplo, Discord ID)
        guildId: text("guildId").notNull(),     // ID del servidor (guild)
        channelId: text("channelId").notNull(), // ID del canal donde el usuario interactúa con el bot
        name: text("name").notNull(),           // Nombre del usuario
    },
    (user) => [
        primaryKey({ columns: [user.id, user.guildId] }) // Clave primaria compuesta (un usuario por servidor)
    ]
);

/**
 * Tabla de tamagochis (esencias).
 * Cada esencia está ligada a un usuario dentro de un servidor.
 */
export const esencia = table(
    "esencia",
    {
        id: text("id").primaryKey(),                // ID único del tamagochi
        name: text("name").notNull(),               // Nombre del tamagochi
        userId: text("userId").notNull(),           // ID del usuario dueño del tamagochi
        guildId: text("guildId").notNull(),         // ID del servidor donde se encuentra
        hunger: integer("hunger").notNull(),        // Nivel de hambre
        happiness: integer("happiness").notNull(),  // Nivel de felicidad
        energy: integer("energy").notNull(),        // Nivel de energía
        age: integer("age").notNull(),              // Porcentaje de crecimiento del tamagochi (0 a 100)
    },
    (esencia) => [
        foreignKey({
            columns: [esencia.userId, esencia.guildId],     // Columnas locales de referencia
            foreignColumns: [user.id, user.guildId],         // Referencia a la tabla 'user'
        })
    ]
);

/**
 * Tabla de aprendizajes.
 * Representa conocimientos o habilidades aprendidas por un tamagochi.
 */
export const learning = table(
    "learning",
    {
        id: text("id").primaryKey(),              // ID único del aprendizaje
        esenciaId: text("esenciaId").notNull(),   // ID del tamagochi (esencia)
        name: text("name").notNull(),             // Nombre del aprendizaje
        level: integer("level").notNull(),        // Nivel del aprendizaje
    },
    (learning) => [
        foreignKey({
            columns: [learning.esenciaId],        // Columna local
            foreignColumns: [esencia.id],         // Referencia a 'esencia.id'
        })
    ]
);

/**
 * Tabla de key de IA.
 * Cada servidor puede tener su propia clave API y modelo de IA configurado.
 */
export const aiKeys = table(
    "aiKeys",
    {
        guildId: text("guildId").notNull(),                      // ID del servidor
        apiKey: text("apiKey"),                                  // Clave API opcional
        model: text("model").notNull().default("gemini-2.0-flash"), // Modelo de IA por defecto
    },
    (aiKeys) => [
        primaryKey({ columns: [aiKeys.guildId] }) // Solo una key por servidor
    ]
);

/**
 * Tabla de estilo visual del tamagochi.
 * Cada tamagochi puede tener su propio color de ropa y accesorio opcional.
 */
export const style = table(
    "style",
    {
        id: text("id").primaryKey(),              // ID único del estilo
        esenciaId: text("esenciaId").notNull(),   // ID del tamagochi al que pertenece este estilo
        clothingColor: text("clothingColor"),     // Color de la ropa (puede estar vacío)
        accessory: text("accessory"),             // Accesorio opcional (puede estar vacío)
    },
    (style) => [
        foreignKey({
            columns: [style.esenciaId],
            foreignColumns: [esencia.id],
        })
    ]
);

/**
 * Tabla de objetos en el mapa.
 * Los objetos están ubicados por coordenadas y relacionados con un tamagochi.
 */
export const map = table(
    "map",
    {
        id: text("id").primaryKey(),         // ID único del objeto
        esenciaId: text("esenciaId").notNull(), // FK al tamagochi propietario
        name: text("name").notNull(),        // Nombre o tipo del objeto
        x: real("x").notNull(),              // Coordenada X
        y: real("y").notNull(),              // Coordenada Y
        z: real("z").notNull(),              // Coordenada Z
        metadata: text("metadata"),          // Información adicional (JSON)
    },
    (map) => [
        foreignKey({
            columns: [map.esenciaId],
            foreignColumns: [esencia.id],
        })
    ]
);