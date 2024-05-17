import getRequestUrl from '../utils/get-request-url';

export type externalApiResult = {
	data: any[];
};

export const fetchSource = async (
	{ fetchClient }: Record<string, any>,
	externalApiUrl?: string,
	inputValue?: string
): Promise<externalApiResult | undefined> => {
	try {
		const { post } = fetchClient;
		const result = await post(getRequestUrl('source'), {
			data: {
				url: externalApiUrl,
				searchQuery: inputValue
			}
		});

		return result;
	} catch {
		return undefined;
	}
};
