import { Link, useSearchParams } from '@remix-run/react';
import { useFieldsModal } from '~/utils/useFieldsModal';
import { CourseFieldsModal } from './CourseFieldsModal';
import { Select } from './Select';
import { TermSelect } from './TermSelect';

export function CoursesFilter(props: {
	selectableTerms: { termId: string; name: string; current: boolean }[];
	fieldsModal: ReturnType<typeof useFieldsModal>;
}) {
	const [_, setSearchParams] = useSearchParams();
	return (
		<div className="py-2 sm:flex sm:space-x-2">
			<div className="sm:flex sm:space-x-2">
				<Select
					label="Campus"
					name="campusCode"
					options={[
						{ value: 'O', label: 'Oxford' },
						{ value: 'H', label: 'Hamilton' },
						{ value: 'L', label: 'Luxembourg' },
						{ value: 'M', label: 'Middletown' },
					]}
					onChange={(event) => {
						setSearchParams({ campusCode: event.target.value });
					}}
				/>
				<TermSelect
					terms={props.selectableTerms}
					onChange={(event) => {
						setSearchParams({ termId: event.target.value });
					}}
				/>
			</div>
			<div className="flex space-x-1">
				<div className="flex flex-col">
					<p className="text-sm font-medium text-gray-700">Fields</p>
					<button
						onClick={() => props.fieldsModal.open()}
						className="py-2 px-3 block mt-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
					>
						{props.fieldsModal.selectedFields.length} Selected
					</button>
					<CourseFieldsModal {...props.fieldsModal} />
				</div>
				<div className="flex grow items-end justify-end">
					<button
						onClick={() => props.fieldsModal.clearFields()}
						className="text-red-600 hover:bg-red-600 hover:text-white py-2 px-3 block mt-1 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
					>
						Clear filters
					</button>
					{/* <Link
						to="/courses/search"
						className="text-red-600 hover:bg-red-600 hover:text-white py-2 px-3 block mt-1 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
					>
						Clear filters
					</Link> */}
				</div>
			</div>
		</div>
	);
}
