// Development-only SQLite adapter; production uses D1 batch's atomic transaction.
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { schema, type EstimateDB, type Statement } from "./estimate-store";
export function sqliteAdapter(db: DatabaseSync): EstimateDB {
  const operations = new WeakMap<Statement, () => unknown>();
  return {
    prepare(sql) {
      let values: (string | number | null)[] = [];
      const statement: Statement = {
        bind(...v) {
          values = v as typeof values;
          return this;
        },
        async run() {
          return db.prepare(sql).run(...values);
        },
        async first<T>() {
          return (db.prepare(sql).get(...values) ?? null) as T | null;
        },
        async all<T>() {
          return { results: db.prepare(sql).all(...values) as T[] };
        },
      };
      operations.set(statement, () => db.prepare(sql).run(...values));
      return statement;
    },
    async batch(statements) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const results = statements.map((s) => {
          const op = operations.get(s);
          if (!op) throw new Error("Foreign statement");
          return op();
        });
        db.exec("COMMIT");
        return results;
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
  };
}
let local: EstimateDB | undefined;
export function localEstimateDB(): EstimateDB {
  if (!local) {
    mkdirSync(resolve(".local"), { recursive: true });
    const db = new DatabaseSync(resolve(".local/calculator-preview.sqlite"));
    db.exec(schema);
    local = sqliteAdapter(db);
  }
  return local;
}
