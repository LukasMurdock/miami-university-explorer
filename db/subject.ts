function scrapeSubjects() {
	// https://bulletin.miamioh.edu/courses-instruction/
	const e = document.getElementById('atozindex');
	if (e) {
		const list = e.getElementsByTagName('li');
		const json = [];
		for (const ele of list) {
			const subject = ele.innerText;
			const code = subject.substring(
				subject.indexOf('(') + 1,
				subject.lastIndexOf(')')
			);
			if (code.length > 0) {
				json.push(code);
			}
		}
		console.log(json.sort());
	}
}

export const subjects = [
	'AAA',
	'ACC',
	'ACE',
	'AES',
	'AMS',
	'APC',
	'ARB',
	'ARC',
	'ART',
	'ASO',
	'ATH',
	'BIO',
	'BIS',
	'BLS',
	'BSC',
	'BUS',
	'BWS',
	'CAS',
	'CCA',
	'CEC',
	'CHI',
	'CHM',
	'CIT',
	'CJS',
	'CLA',
	'CLS',
	'CMA',
	'CMR',
	'CMS',
	'CPB',
	'CRE',
	'CSE',
	'DST',
	'ECE',
	'ECO',
	'EDL',
	'EDP',
	'EDT',
	'EGM',
	'EGS',
	'EHS',
	'ENG',
	'ENT',
	'ESP',
	'FAS',
	'FIN',
	'FRE',
	'FST',
	'FSW',
	'GEO',
	'GER',
	'GHS',
	'GIC',
	'GLG',
	'GRK',
	'GSC',
	'GTY',
	'HON',
	'HST',
	'HUM',
	'IDS',
	'IES',
	'IMS',
	'ISA',
	'ITL',
	'ITS',
	'JPN',
	'JRN',
	'KNH',
	'KOR',
	'LAS',
	'LAT',
	'LST',
	'LUX',
	'MAC',
	'MBI',
	'MGT',
	'MJF',
	'MKT',
	'MME',
	'MSC',
	'MTH',
	'MUS',
	'NCS',
	'NSC',
	'NSG',
	'ORG',
	'PHL',
	'PHY',
	'PLW',
	'PMD',
	'POL',
	'POR',
	'PSS',
	'PSY',
	'REL',
	'RUS',
	'SJS',
	'SLM',
	'SOC',
	'SPA',
	'SPN',
	'STA',
	'STC',
	'THE',
	'UNV',
	'WGS',
	'WST',
];