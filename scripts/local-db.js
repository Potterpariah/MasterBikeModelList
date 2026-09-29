import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
// In-memory SQLite adapter for local checks. Never connects to remote D1 or R2.
export function localEnv() {
  const db = new DatabaseSync(':memory:');
  for (const name of ['0001_schema.sql','0002_seed_stage3.sql']) db.exec(readFileSync(new URL('../migrations/'+name,import.meta.url),'utf8'));
  function prepare(sql) {
    let args=[];
    return {
      bind(...values){args=values;return this;},
      async first(){return db.prepare(sql).get(...args) || null;},
      async all(){return {results:db.prepare(sql).all(...args)};},
      async run(){return db.prepare(sql).run(...args);}
    };
  }
  return {DB:{prepare,batch:statements=>Promise.all(statements.map(s=>s.run()))},ENVIRONMENT:'development',SESSION_TTL_DAYS:'30',_db:db};
}
