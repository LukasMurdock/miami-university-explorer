import Database from 'better-sqlite3';
import { initModels } from '../app/models/index';

const db = new Database('./data/sqlite.db');
const model = initModels(db);

async function generate() {
	// cleanup the existing database
	// model.courseInstance.createTable();

	console.log(`Database has been seeded. 🌱`);
}

generate().catch((e) => {
	console.error(e);
	process.exit(1);
});
// .finally(async () => {
// 	await prisma.$disconnect();
// });
