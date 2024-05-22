const find = async (ctx) => {
	return strapi.service('plugin::internal-links.external-source').getexternalApiData(ctx.request.body.data);
};

export default {
	find
};
