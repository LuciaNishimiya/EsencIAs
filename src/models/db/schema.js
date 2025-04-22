import { text, real, integer, foreignKey, sqliteTable as table, primaryKey } from "drizzle-orm/sqlite-core";

/**
 * Tabla de usuarios.
 * Representa un usuario único dentro de un servidor específico en Discord.
 */
export const user = table(
    "user",
    {
        id: text("id").primaryKey().notNull(), // ID del Discord del usuario
        name: text("name").notNull(),           // Nombre del usuario
    }
);

/**
 * Tabla de esencias.
 * Cada esencia está ligada a un usuario dentro de un servidor.
 */
export const esencia = table(
    "esencia",
    {
        id: integer("id").primaryKey(),                // ID de la esencia
        name: text("name").notNull(),               // Nombre de la esencia 
        userId: text("userId").notNull(),           // ID del usuario dueño de la esencia
        guildId: text("guildId").notNull(),         // ID del servidor donde se encuentra
        channelId: text("channelId").notNull(),     // ID del canal donde el usuario interactúa con la esencia
        hunger: real("hunger").notNull().default(50),      // Nivel de hambre 
        happiness: real("happiness").notNull().default(50),// Nivel de felicidad
        energy: real("energy").notNull().default(20),      // Nivel de energía
        love: real("love").notNull().default(50),          // Nivel de amor
        health: real("health").notNull().default(100),     // Salud de la esencia
        createdAt: text("createdAt").notNull(),     // Fecha de creación de la esencia
        lastInteraction: text("lastInteraction"),   // Fecha de la última interacción con la esencia
    },
    (esencia) => [
        foreignKey({
            columns: [esencia.userId],     // Columnas locales de referencia
            foreignColumns: [user.id],         // Referencia a la tabla 'user'
        })
    ]
);

/**
 * Tabla de aprendizajes.
 * Representa conocimientos o habilidades aprendidas por una esencia.
 */
export const learning = table(
    "learning",
    {
        id: integer("id").primaryKey(), // ID autoincremental
        esenciaId: text("esenciaId").notNull(), // FK a esencia 
        knowledge: text("knowledge").notNull(), // Conocimiento o habilidad aprendida
    },
    (learning) => [
        foreignKey({
            columns: [learning.esenciaId],
            foreignColumns: [esencia.id],
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
 * Tabla de estilo visual de la esencia.
 * Cada esencia puede tener su propio color de ropa y accesorio opcional.
 */
export const style = table(
    "style",
    {
        esenciaId: text("esenciaId").primaryKey().notNull(),   // ID de la esencia (clave primaria y FK)
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
 * Los objetos están ubicados por coordenadas y relacionados con una esencia.
 */
export const map = table(
    "map",
    {
        id: integer("id").primaryKey(),         // ID único del objeto
        esenciaId: text("esenciaId").notNull(), // FK a la esencia propietaria
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