import { useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import objGet from 'lodash/get';
import { useFetchClient } from '@strapi/helper-plugin';
import { Flex, FieldLabel } from '@strapi/design-system';
import { Combobox, IReactSelectValue } from '../../Combobox';
import getTrad from '../../../utils/get-trad';
import { Label } from '../../label';
import { ExternalApiResult, fetchSource } from '../../../api/fetch-source';
import { IInternalLink } from '../../factory';

const SEARCH_DEBOUNCE_MS = 150;

interface Props {
	selectedValue?: IInternalLink;
	externalApiUrl: string;
	externalApiLabelpath?: string;
	externalApiValuepath?: string;
	externalApiCategorieLabelPath?: string;
	onChange: (item?: Record<string, any>) => void;
}

export const ExternalApiSearch = ({
	onChange,
	selectedValue,
	externalApiUrl,
	externalApiLabelpath,
	externalApiValuepath,
	externalApiCategorieLabelPath
}: Props) => {
	const { formatMessage } = useIntl();
	const fetchClient = useFetchClient();
	const mappedSelectedValue = mapSelectItem(selectedValue);

	const getItems = async (inputValue: string): Promise<IReactSelectValue[]> => {
		if (!externalApiUrl) {
			throw new Error('No URL field set in settings');
		}

		const externalItems = await fetchSource({ fetchClient, externalApiUrl, inputValue });
		if (!externalItems || !externalApiLabelpath || !externalApiValuepath) {
			return [];
		}

		// fetch gives data back, but some apis gives also data back so you get data.data
		const data = checkData(externalItems);

		const mappedData = data.map((item: Record<string, any>) => ({
			value: objGet(item, externalApiValuepath),
			label: externalApiCategorieLabelPath
				? `${objGet(item, externalApiCategorieLabelPath)} - ${objGet(item, externalApiLabelpath)}`
				: objGet(item, externalApiLabelpath)
		}));

		return mappedData;
	};

	const handleChange = (item?: IReactSelectValue) => onChange(item);

	const getExternalData = debounce((searchTerm, callback) => {
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
						id: getTrad('internal-link.form.source.start')
					})}
				</FieldLabel>
			</Label>
			<Flex width="100%" gap={2}>
				<Combobox
					key={`externalApiSearch`}
					id="externalApiSearch"
					loadOptions={(searchTerm, callback) => getExternalData(searchTerm, callback)}
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
function mapSelectItem(value?: IInternalLink): IReactSelectValue | null {
	return value && value.externalLabel && value.externalApiValue
		? {
				value: value.externalApiValue,
				label: value.externalLabel
		  }
		: null;
}

function checkData(externalItems: ExternalApiResult) {
	if (externalItems.data.data) {
		return externalItems.data.data;
	}
	return externalItems.data;
}
