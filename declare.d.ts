declare module 'connect-sqlite3' {
  import session from 'express-session';
  
  interface SQLiteStoreOptions {
    db: string;
    dir?: string;
    table?: string;
    concurrentDB?: boolean;
    mode?: number;
  }
  
  class SQLiteStore extends session.Store {
    constructor(options: SQLiteStoreOptions);
  }
  
  export default function(session: typeof import('express-session')): {
    new (options?: SQLiteStoreOptions): SQLiteStore;
  };
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