import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

export function useFieldsModal() {
	// const [searchParams, setSearchParams] = useSearchParams();
	const fieldsFallback = ['title', 'description'];
	const [storedFields, setStoredFields] = useLocalStorage(
		'fields',
		JSON.stringify(fieldsFallback)
	);

	const defaultFields = storedFields
		? (JSON.parse(storedFields) as string[])
		: fieldsFallback;

	const [isOpen, setIsOpen] = useState(false);
	const [selectedFields, setSelectedFields] = useState(defaultFields);

	return {
		isOpen,
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
		selectedFields: selectedFields,
		clearFields: () => {
			setSelectedFields([]);
			setStoredFields(JSON.stringify([]));
		},
		addField: (field: string) => {
			const updatedFieldList = [...selectedFields, field];
			setSelectedFields(updatedFieldList);
			setStoredFields(JSON.stringify(updatedFieldList));
			// searchParams.append('fields', field);
			// setSearchParams(searchParams);
		},
		removeField: (field: string) => {
			const newSelectedFields = selectedFields.filter((f) => f !== field);
			setSelectedFields(newSelectedFields);
			setStoredFields(JSON.stringify(newSelectedFields));
			// filter out key field from the search params, but keep the rest
			// searchParams.delete('fields');
			// newSelectedFields.forEach((id) => {
			// 	searchParams.append('fields', id);
			// });
			// setSearchParams(searchParams);
		},
	};
}
