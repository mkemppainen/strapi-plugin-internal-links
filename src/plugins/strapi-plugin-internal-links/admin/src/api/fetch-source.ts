import getRequestUrl from '../utils/get-request-url';

type FetchSourceParams = {
	fetchClient: any;
	externalApiUrl: string;
	inputValue: string;
};

export type ExternalApiResult = {
	data: Record<string, any>;
};

export const fetchSource = async ({
	fetchClient,
	externalApiUrl,
	inputValue
}: FetchSourceParams): Promise<ExternalApiResult | undefined> => {
	try {
		if (!externalApiUrl) {
			throw new Error('No URL field set in settings');
		}
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
