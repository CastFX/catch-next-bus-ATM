import { writeSchemaSQL } from ".";

await writeSchemaSQL();

const proc = Bun.spawnSync([
  "wrangler",
  "d1",
  "execute",
  "catch-next-bus-atm-db",
  "--local",
  '--file="src/db/migrations/schema.sql"',
]);

console.log(proc.stdout.toString());
