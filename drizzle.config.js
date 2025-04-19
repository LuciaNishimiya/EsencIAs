
export default {
    schema: "./src/models/db/schema.js",
    out: "./drizzle/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "./database.sqlite",
    },
} 