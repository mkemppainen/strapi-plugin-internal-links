type ExternalApiData = {
	url: string;
	searchQuery: string;
};

const getexternalApiData = async (data: ExternalApiData) => {
	const url = createUrl(data);
	// @ts-ignore
	const result = await (await fetch(url)).json();
	return result;
};

const createUrl = (data: ExternalApiData) => {
	return `${data.url}${data.searchQuery}`;
};

export default {
	getexternalApiData
};
