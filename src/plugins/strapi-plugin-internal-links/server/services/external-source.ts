import axios from 'axios';

type externalApiData = {
	url: string;
	searchQuery: string;
};

const getexternalApiData = async (data: externalApiData) => {
	const url = createUrl(data);
	const res = (await axios.get(url)).data;
	return res;
};

const createUrl = (data: externalApiData) => {
	if (!data.searchQuery) {
		return data.url;
	}
	return `${data.url}${data.searchQuery}`;
};

export default {
	getexternalApiData
};
