const find = async (ctx) => {
	console.log(ctx);
	return strapi.service('plugin::internal-links.external-source').getExternalSourceData({});
};

export default {
	find
};
