import { CourseSections } from '~/lib/ws.miamioh.edu/api-types';

export const selectableFields = [
	{
		title: 'Title',
		key: 'title',
	},
	{
		title: 'Description',
		key: 'description',
	},
	{
		title: 'CRN',
		key: 'courseId',
	},
	{
		title: 'Credit Hours',
		key: 'creditHours',
	},
	{
		title: 'Available Seats',
		key: 'availableSeats',
	},
	{
		title: 'Attributes',
		key: 'attributes',
	},
	{
		title: 'Enrollment',
		key: 'enrollment',
	},
	{
		title: 'Instructors',
		key: 'instructors',
	},
	{
		title: 'Dates',
		key: 'dates',
	},
	{
		title: 'Days',
		key: 'days',
	},
	{
		title: 'Time',
		key: 'time',
	},
	{
		title: 'Room',
		key: 'room',
	},
	{
		title: 'Building',
		key: 'building',
	},
] as const;

type GeneratedField = typeof selectableFields[number] & { description: string };

// search param key -> mapping -> {title, value}[]
export function generateFieldMapping(
	section: CourseSections['courseSections'][number]
): GeneratedField[] {
	return [
		{
			title: 'Title',
			key: 'title',
			description: section.courseTitle,
		},
		{
			title: 'Description',
			key: 'description',
			description: section.courseDescription,
		},
		{
			title: 'CRN',
			key: 'courseId',
			description: section.courseId,
		},
		{
			title: 'Credit Hours',
			key: 'creditHours',
			description: `${section.lectureHoursLow} - ${section.lectureHoursHigh}`,
		},
		{
			title: 'Available Seats',
			key: 'availableSeats',
			description: section.enrollmentCountAvailable,
		},
		{
			title: 'Attributes',
			key: 'attributes',
			description: section.attributes
				.map((attribute) => attribute.attributeCode)
				.join(', '),
		},
		{
			title: 'Enrollment',
			key: 'enrollment',
			description: `${section.enrollmentCountCurrent} / ${section.enrollmentCountMax}`,
		},
		{
			title: 'Instructors',
			key: 'instructors',
			description: section.instructors
				.map(
					(instructor) =>
						`${
							instructor.nameDisplayFormal
						} (${instructor.username.toLowerCase()})`
				)
				.join(', '),
		},
		{
			title: 'Dates',
			key: 'dates',
			description: section.courseSchedules
				.map(
					(schedule) => `${schedule.startDate} - ${schedule.endDate}`
				)
				.join(', '),
		},
		{
			title: 'Days',
			key: 'days',
			description: section.courseSchedules
				.map((schedule) => `${schedule.days}`)
				.join(', '),
		},
		{
			title: 'Time',
			key: 'time',
			description: section.courseSchedules
				.map(
					(schedule) => `${schedule.startTime} - ${schedule.endTime}`
				)
				.join(', '),
		},
		{
			title: 'Room',
			key: 'room',
			description: section.courseSchedules
				.map((schedule) => schedule.room)
				.join(', '),
		},
		{
			title: 'Building',
			key: 'building',
			description: section.courseSchedules
				.map(
					(schedule) =>
						`${schedule.buildingName} (${schedule.buildingCode})`
				)
				.join(', '),
		},
	];
}
