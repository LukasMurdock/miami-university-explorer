import { z } from 'zod';
import { Database } from 'better-sqlite3';
import { ConversionProps, convertZodToSQLite, SchemaKeys } from './zod-to-sql';

function valueToSQL(value: unknown) {
	if (typeof value === 'string') {
		return `'${value}'`;
	}
	return value;
}

function JSONtoValues(data: { [keys: string]: unknown }) {
	return Object.values(data).map(valueToSQL).join(', ');
}

function JSONtoSQLColumnsAndValues(data: { [keys: string]: unknown }) {
	const columns = Object.keys(data).join(', ');
	const values = JSONtoValues(data);

	return { columns, values };
}

function createTable<T extends z.ZodTypeAny, SchemaKey extends SchemaKeys<T>>(
	db: Database,
	props: ConversionProps<T, SchemaKey>
) {
	const SQLiteSchema = convertZodToSQLite(props);
	const createTableQuery = `CREATE TABLE IF NOT EXISTS ${
		props.tableName
	} (${SQLiteSchema.join(', ')})`;
	db.prepare(createTableQuery).run();
	console.log('created table', props.tableName);
}

export function DbModel<
	T extends z.ZodTypeAny,
	SchemaKey extends SchemaKeys<T>
>(props: ConversionProps<T, SchemaKey>) {
	type modelProps = z.infer<typeof props.zodSchema>;

	function initModel(db: Database) {
		createTable(db, props);
		return {
			tableName: props.tableName,
			deleteAll: () => {
				console.log('deleting all', props.tableName);
				db.prepare(`DROP TABLE IF EXISTS ${props.tableName}`).run();
				createTable(db, props);
				console.log('deleted all', props.tableName);
			},
			schema: props.zodSchema,
			safeParse(
				data: unknown
			):
				| { success: true; data: modelProps }
				| { success: false; error: z.ZodError } {
				return props.zodSchema.safeParse(data);
			},
			upsert(data: modelProps) {
				const { columns, values } = JSONtoSQLColumnsAndValues(data);
				const sets = columns
					.split(', ')
					.map((column) => `${column} = ${valueToSQL(data[column])}`)
					.join(', ');
				const statement = `INSERT INTO ${props.tableName} (${columns}) VALUES (${values}) ON CONFLICT(id) DO UPDATE SET ${sets}`;
				db.prepare(statement).run(data);
				return data;
			},
			create: (data: Required<modelProps>) => {
				const { columns, values } = JSONtoSQLColumnsAndValues(data);
				const statement = `INSERT INTO ${props.tableName} (${columns}) VALUES (${values})`;
				console.log(statement);
				db.prepare(statement).run(data);
				return data;
			},
			get: (id: string) => {
				return db
					.prepare(`SELECT * FROM ${props.tableName} WHERE id = ?`)
					.get(id) as modelProps;
			},
			getMany: (ids: string[]) => {
				return db
					.prepare(`SELECT * FROM ${props.tableName} WHERE id IN (?)`)
					.all(ids) as modelProps[];
			},
			update: (id: string, data: Partial<modelProps>) => {
				const { columns, values } = JSONtoSQLColumnsAndValues(data);
				const statement = `UPDATE ${props.tableName} SET ${columns} WHERE id = ${id}`;
				db.prepare(statement).run(data);
				return data;
			},
			delete: (id: string) => {
				db.prepare(`DELETE FROM ${props.tableName} WHERE id = ?`).run(
					id
				);
			},
		};
	}

	return initModel;
}
