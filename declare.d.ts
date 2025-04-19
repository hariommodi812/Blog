declare module 'connect-sqlite3' {
  import session from 'express-session';
  export default function(session: typeof import('express-session')): session.Store;
}

declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
  }

  interface Statement {
    run(...params: any[]): { lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  export default function(path: string): Database;
}