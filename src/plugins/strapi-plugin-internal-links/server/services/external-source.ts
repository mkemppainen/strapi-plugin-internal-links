import axios from 'axios';

type ExternalSourceData = {
	url: string;
	searchQuery: string;
};

const getExternalSourceData = async (data: ExternalSourceData) => {
	const url = createUrl(data);
	const res = (await axios.get(url)).data;
	return res;
};

const createUrl = (data: ExternalSourceData) => {
	if (!data.searchQuery) {
		return data.url;
	}
	return `${data.url}?searchQuery=${data.searchQuery}`;
};

export default {
	getExternalSourceData
};
