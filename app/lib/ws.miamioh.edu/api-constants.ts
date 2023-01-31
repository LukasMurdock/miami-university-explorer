export const TermMap = {
	fall: 10,
	winter: 15,
	spring: 20,
	summer: 30,
};

export enum Term {
	FALL = 10,
	WINTER = 15,
	SPRING = 20,
	SUMMER = 30,
}

// Term Id is formatted like `${startYear}${term}`
// e.g. 202110 for Fall 2021
// e.g. 202115 for Winter 2021
export function formatTermId(termId: string) {
	const term = termId.slice(-2);
	const year = termId.slice(0, -2);
	const termName = Term[term as keyof typeof Term];
	return `${termName} ${year}`;
}

export const CampusMap = {
	Oxford: 'O',
	Hamilton: 'H',
	Luxembourg: 'L',
	Middletown: 'M',
};

export const CampusCode = {
	O: 'Oxford',
	H: 'Hamilton',
	L: 'Luxembourg',
	M: 'Middletown',
};

export type TermStrings = keyof typeof Term;
export type CampusCodeStrings = keyof typeof CampusCode;
