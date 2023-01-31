import { z } from 'zod';

// A generic function that returns a union of the string literals from the keys of T
type Strings<T> = T extends string ? T : never;

export type SchemaKeys<T extends z.ZodTypeAny> = Strings<keyof z.infer<T>>;

export type ConversionOptions<SchemaKey> = {
	primaryKey: SchemaKey;
	unique?: SchemaKey[];
	foreignKey?: SchemaKey[];
};

export type ConversionProps<
	T extends z.ZodTypeAny,
	SchemaKey extends SchemaKeys<T>
> = {
	zodSchema: T;
	tableName: string;
	options: ConversionOptions<SchemaKey>;
};

function convertZodTypeToSQLiteType(value: unknown) {
	if (value instanceof z.ZodString) {
		return 'TEXT';
	}
	if (value instanceof z.ZodNumber) {
		return 'INTEGER';
	}
	return 'TEXT';
}

function getZodSQLiteAttributes<
	T extends z.ZodTypeAny,
	SchemaKey extends SchemaKeys<T>
>(fieldName: SchemaKey, props: ConversionProps<T, SchemaKey>) {
	// @ts-ignore
	const shape = props.zodSchema.shape[fieldName];
	const value = shape._def.value;
	// If value is 'id', then SQLite column is PRIMARY KEY
	if (fieldName === props.options.primaryKey) {
		return 'PRIMARY KEY';
	}

	// If zod schema is not nullable, add NOT NULL
	if (!shape.isNullable() && !shape.isOptional()) {
		return 'NOT NULL';
	}
	// handle unique
	if (props.options?.unique && props.options?.unique.includes(fieldName)) {
		return 'UNIQUE';
	}

	return '';

	// TODO: add default support
	// TODO: (undefined) vs catch (parse error)
	// TODO: add FOREIGN KEY support
}

function convertZodSchemaToSQLiteColumn<
	T extends z.ZodTypeAny,
	SchemaKey extends SchemaKeys<T>
>(fieldName: SchemaKey, conversionProps: ConversionProps<T, SchemaKey>) {
	// TODO: Type shape
	const type = convertZodTypeToSQLiteType(
		// @ts-ignore
		conversionProps.zodSchema.shape[fieldName]
	);
	const attributes = getZodSQLiteAttributes(fieldName, conversionProps);
	return `${fieldName} ${type}${attributes ? ' ' + attributes : ''}`;
}

export function convertZodToSQLite<
	T extends z.ZodTypeAny,
	SchemaKey extends SchemaKeys<T>
>(props: ConversionProps<T, SchemaKey>) {
	// @ts-ignore
	// TODO: Type shape
	const schemaValues = Object.keys(props.zodSchema.shape);

	const SQLiteSchema = schemaValues.map((fieldName) =>
		// @ts-ignore
		convertZodSchemaToSQLiteColumn(fieldName, props)
	);

	return SQLiteSchema;
}
