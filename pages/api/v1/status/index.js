import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const serverVersion = await database
    .query("SHOW server_version;")
    .then((result) => result.rows[0].server_version);

  const maxConnections = await database
    .query("SHOW max_connections;")
    .then((result) => result.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnetions = await database
    .query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    })
    .then((result) => result.rows[0].count);

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: serverVersion,
        max_connections: parseInt(maxConnections),
        opened_connetions: databaseOpenedConnetions,
      },
    },
  });
}

export default status;
