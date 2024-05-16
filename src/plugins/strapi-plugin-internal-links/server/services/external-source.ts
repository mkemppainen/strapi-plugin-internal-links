import axios from 'axios';

const getExternalSourceData = async (url: string) => {
	// TODO get from config
	const res = (await axios.get('http://localhost:3000')).data;
	console.log(strapi.config);
	return res;
};

export default {
	getExternalSourceData
};
