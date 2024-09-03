import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const getVersionDb = await database.query("SHOW server_version;");
  
  const version = getVersionDb.rows[0].server_version;

  const getMaxConnections = await database.query("SHOW max_connections;");

  const maxConnections = parseInt(getMaxConnections.rows[0].max_connections)

  const dbName = process.env.POSTGRES_DB;

  const getConectionUsed = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName]
  });
  const conectionUsed = getConectionUsed.rows[0].count

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: version,
        max_connections: maxConnections,
        connection_used: conectionUsed,
      },
    },
  });
}

export default status;
