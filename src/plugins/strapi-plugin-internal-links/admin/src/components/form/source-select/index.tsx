import { useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import { useFetchClient } from '@strapi/helper-plugin';
import { Flex, FieldLabel } from '@strapi/design-system';

import { Combobox, IReactSelectValue } from '../../Combobox';
import getTrad from '../../../utils/get-trad';
import { Label } from '../../label';

import { fetchSource } from '../../../api/fetch-source';
const SEARCH_DEBOUNCE_MS = 150;

interface Props {
	selectedValue?: string;
	onChange: (item?: any) => void;
}

export const ExternalSourceSearch = ({ onChange, selectedValue }: Props) => {
	const { formatMessage } = useIntl();
	const fetchClient = useFetchClient();

	console.log(selectedValue);
	const nuValue = { id: 1, value: selectedValue, label: selectedValue };

	const vowValue = mapSelectItem(selectedValue);

	const getItems = async (): Promise<IReactSelectValue[]> => {
		// TODO: Mooi maken
		const externalItems = await fetchSource({ fetchClient });
		if (!externalItems) {
			return [];
		}

		const mappedData = externalItems.data.map((item: any) => ({
			id: item.id,
			value: item.startPointReference,
			label: item.question
		}));

		return mappedData;
	};

	const handleChange = (item?: IReactSelectValue) => onChange(item);

	const debouncedFetch = debounce((searchTerm, callback) => {
		promiseOptions(searchTerm).then((result) => {
			return callback(result || []);
		});
	}, SEARCH_DEBOUNCE_MS);

	const promiseOptions = (inputValue: string): Promise<any[]> =>
		new Promise<any[]>((resolve) => {
			resolve(getItems());
		});

	return (
		<Flex direction="column" width="100%">
			<Label>
				<FieldLabel required>
					{formatMessage({
						id: getTrad('internal-link.form.page')
					})}
				</FieldLabel>
			</Label>
			<Flex width="100%" gap={2}>
				<Combobox
					key={`somethinggg`}
					id="collectionTypeSearch"
					loadOptions={(i, c) => debouncedFetch(i, c)}
					cacheOptions
					// @ts-ignore onChange is correct
					onChange={handleChange}
					value={vowValue}
					placeholder={formatMessage({
						id: getTrad('internal-link.form.source.placeholder')
					})}
					required
				/>
			</Flex>
		</Flex>
	);
};
function mapSelectItem(value?: string): IReactSelectValue | null {
	return value
		? {
				value: value,
				label: value
		  }
		: null;
}
