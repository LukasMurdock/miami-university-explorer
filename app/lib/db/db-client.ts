import Database from 'better-sqlite3';
import { initModels } from '~/models';

// Prisma ref:
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications

export type Db = ReturnType<typeof Database> & {
	model: ReturnType<typeof initModels>;
};

// add db to the NodeJS global type
type NodeJSGlobal = typeof global;
// @ts-ignore
interface CustomNodeJsGlobal extends NodeJS.Global {
	db: Db;
}

// Prevent multiple instances of db in development
declare const global: CustomNodeJsGlobal;

let db = global.db || new Database('/data/sqlite.db');

// add Models to db
db.model = initModels(db);

if (process.env.NODE_ENV === 'development') global.db = db;

export default db;
