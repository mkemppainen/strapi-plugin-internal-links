import getRequestUrl from '../utils/get-request-url';

export type externalApiResult = {
	data: any[];
};

export const fetchSource = async ({ fetchClient }: Record<string, any>): Promise<externalApiResult | undefined> => {
	try {
		const { get } = fetchClient;
		const result = await get(getRequestUrl('source'));

		return result;
	} catch {
		return undefined;
	}
};
