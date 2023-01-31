import Database from 'better-sqlite3';
import { initModels } from '../app/models/index';

const db = new Database('./db.sqlite');
const model = initModels(db);

async function seed() {
	// cleanup the existing database
	model.courseInstance.deleteAll();

	// model.courseInstance.create({
	// 	id: '20181',
	// 	campus: 'O',
	// 	subject: 'AES',
	// 	title: 'My first course',
	// 	code: '122',
	// 	term: '202220',
	// 	section: 'A',
	// 	description: 'Description here',
	// 	instructionType: 'Lecture',
	// 	credits: 1,
	// 	enrollmentMax: 10,
	// });

	console.log(`Database has been seeded. 🌱`);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
// .finally(async () => {
// 	await prisma.$disconnect();
// });
