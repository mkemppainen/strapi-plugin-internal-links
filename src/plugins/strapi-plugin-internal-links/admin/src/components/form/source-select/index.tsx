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
	externalApiUrl?: string;
	externalApiValueMapping?: string;
	externalApiLabelMapping?: string;
	onChange: (item?: any) => void;
}

export const ExternalApiSearch = ({
	onChange,
	selectedValue,
	externalApiUrl,
	externalApiLabelMapping,
	externalApiValueMapping
}: Props) => {
	const { formatMessage } = useIntl();
	const fetchClient = useFetchClient();

	const mappedSelectedValue = mapSelectItem(selectedValue);

	const getItems = async (inputValue?: string): Promise<IReactSelectValue[]> => {
		const externalItems = await fetchSource({ fetchClient }, externalApiUrl, inputValue);
		if (!externalItems || !externalApiLabelMapping || !externalApiValueMapping) {
			return [];
		}

		const mappedData = externalItems.data.map((item: any) => ({
			value: item[externalApiValueMapping],
			label: item[externalApiLabelMapping]
		}));

		return mappedData;
	};

	const handleChange = (item?: IReactSelectValue) => onChange(item);

	const debouncedFetch = debounce((searchTerm, callback) => {
		promiseOptions(searchTerm).then((result) => {
			return callback(result || []);
		});
	}, SEARCH_DEBOUNCE_MS);

	const promiseOptions = (inputValue: string): Promise<IReactSelectValue[]> =>
		new Promise<IReactSelectValue[]>((resolve) => {
			resolve(getItems(inputValue));
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
					key={`externalApiSearch`}
					id="externalApiSearch"
					loadOptions={(i, c) => debouncedFetch(i, c)}
					cacheOptions
					// @ts-ignore onChange is correct
					onChange={handleChange}
					value={mappedSelectedValue}
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
