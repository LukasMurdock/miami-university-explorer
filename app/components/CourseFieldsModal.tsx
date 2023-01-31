import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useFieldsModal } from '~/utils/useFieldsModal';
import { selectableFields } from './CourseSearch/fields';

export function CourseFieldsModal(props: ReturnType<typeof useFieldsModal>) {
	return (
		<Transition.Root show={props.isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={props.close}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden w-full rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Select fields
								</Dialog.Title>

								{selectableFields.map((field) => (
									<div
										key={field.key}
										className="flex items-center"
									>
										<input
											className="mr-2"
											type="checkbox"
											id={field.key}
											name={field.key}
											value={field.key}
											checked={props.selectedFields.includes(
												field.key
											)}
											onChange={(e) => {
												console.log('onchange');
												console.log(
													props.selectedFields
												);
												if (e.target.checked) {
													props.addField(field.key);
												} else {
													props.removeField(
														field.key
													);
												}
											}}
										/>
										<label htmlFor={field.key}>
											{field.title}
										</label>
									</div>
								))}

								{/* <Checkboxes
										onChange={handleChange}
										caption={'Select Fields'}
										options={selectableFields.map(
											(field) => ({
												label: field.title,
												value: field.key,
												checked:
													selectedFields.includes(
														field.key
													),
											})
										)}
									/> */}
								{/* <CheckboxSelect
										label={'Fields'}
										options={options}
										handleChange={handleChange}
									/> */}

								<div className="mt-5 sm:mt-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:border-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:text-sm"
										onClick={props.close}
									>
										Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
