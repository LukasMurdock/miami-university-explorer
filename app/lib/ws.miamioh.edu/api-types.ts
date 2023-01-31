export type CampusCode = 'O' | 'H' | 'M';

export type ApiRequest<T> = {
	data: T;
	status: number;
	error: boolean;
};

export type ApiTerm = {
	termId: string;
	name: string;
	startDate: string;
	endDate: string;
	academicTermResource: string;
	displayTerm: boolean;
};

export type CourseSections = {
	courseSections: CourseSection[];
};

interface CourseSchedule {
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	room: string;
	buildingCode: string;
	buildingName: string;
	days: string;
	scheduleTypeCode: string;
	scheduleTypeDescription: string;
}

interface Instructor {
	username: string;
	nameLast: string;
	nameFirst: string;
	nameMiddle: string;
	namePrefix: string;
	nameSuffix?: any;
	nameFirstPreferred: string;
	nameDisplayInformal: string;
	nameDisplayFormal: string;
	nameSortedInformal: string;
	nameSortedFormal: string;
	personResource: string;
	primaryInstructor: string;
}

interface Attribute {
	attributeCode: string;
	attributeDescription: string;
}

interface CrossListedCours {
	term: string;
	crn: string;
	subjectCode: string;
	courseNumber: string;
}

interface CourseSection {
	academicTerm: string;
	academicTermDesc: string;
	courseId: string;
	recordNumber: string;
	courseCode: string;
	schoolCode: string;
	schoolName: string;
	deptName: string;
	deptCode: string;
	standardizedDivisionCode: string;
	standardizedDivisionName: string;
	standardizedDeptCode: string;
	standardizedDeptName: string;
	traditionalStandardizedDeptCode: string;
	traditionalStandardizedDeptName: string;
	courseTitle: string;
	instructionalType: string;
	instructionalTypeDescription: string;
	courseSubjectCode: string;
	courseSubjectDesc: string;
	courseNumber: string;
	courseSectionCode: string;
	courseStatus: string;
	campusCode: string;
	campusName: string;
	creditHoursDesc: string;
	creditHoursHigh: string;
	creditHoursLow: string;
	lectureHoursDesc: string;
	lectureHoursLow: string;
	lectureHoursHigh: string;
	labHoursDesc: string;
	labHoursLow: string;
	labHoursHigh: string;
	enrollmentCountMax: string;
	enrollmentCountCurrent: string;
	enrollmentCountActive: string;
	enrollmentCountAvailable: string;
	partOfTermCode: string;
	partOfTermName: string;
	partOfTermStartDate: string;
	partOfTermEndDate: string;
	midtermGradeSubmissionAvailable: string;
	finalGradeSubmissionAvailable: string;
	gradeRequiredFinal: string;
	courseDescription: string;
	prntInd: string;
	courseSchedules: CourseSchedule[];
	instructors: Instructor[];
	attributes: Attribute[];
	crossListedCourses: CrossListedCours[];
	courseSectionResource: string;
	enrollmentResource: string;
	academicTermResource: string;
}

// http://ws.miamioh.edu/api/swagger-ui/#!/Building/get_building_v1
export interface Building {
	buildingCode: string;
	buildingName: string;
	buildingAddress: string;
	buildingCity: string;
	buildingZip: string;
	buildingState: string;
	campusCode: CampusCode;
	latitude: string;
	longitude: string;
	iconURL: string;
	imageURL: string;
	parentResource: string;
	phoneNumber: string;
	wifi: string;
	buildingFunction: string;
}
