import { Database } from 'better-sqlite3';
import { DbModel } from '../lib/db/db-model';
import { CourseInstanceSchema } from './courseInstance';

export function initModels(db: Database) {
	return {
		courseInstance: DbModel({
			tableName: 'course_instances',
			zodSchema: CourseInstanceSchema,
			options: {
				primaryKey: 'id',
			},
		})(db),
	};
}
