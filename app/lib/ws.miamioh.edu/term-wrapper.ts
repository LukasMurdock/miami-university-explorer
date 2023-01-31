import { getAcademicTerms, getCurrentAcademicTerm } from './api';
import { ApiTerm } from './api-types';

type FormattedTerm = {
	termId: string;
	name: string;
	current: boolean;
};

function sortTerms(terms: FormattedTerm[]) {
	return [...terms].sort((a, b) => (a.termId > b.termId ? -1 : 1));
}

// format is "Fall Semester 2022-23"
// We want the format to be "Fall 2022"
function formatTermName(term: string) {
	return term.replace('Term ', '').replace('Semester ', '');
	// remove the word "Semester" or "Term" from the term name
	// then remove everything after the '-' character
	// return term.replace(/(Semester|Term)/, '').split('-')[0];
	// return term.replace('Term ', '').replace('Semester ', '');
	// .split(' ')
	// .reverse()
	// .join(' ');
}

function formatTerm(term: ApiTerm, currentTerm: string) {
	return {
		termId: term.termId,
		name: formatTermName(term.name),
		current: term.termId === currentTerm,
	};
}

function formatTerms(terms: ApiTerm[], currentTerm: string) {
	return terms.map((term) => formatTerm(term, currentTerm));
}

export async function fetchSelectableTerms(
	{ next, previous } = { next: 3, previous: 2 }
) {
	const currentTerm = await getCurrentAcademicTerm();
	const terms = await getAcademicTerms({
		termId: currentTerm.data.termId,
		next,
		previous,
	});

	return sortTerms(formatTerms(terms.data, currentTerm.data.termId));
}
