const find = async (ctx) => {
	return strapi.service('plugin::internal-links.external-source').getExternalSourceData(ctx.request.body.data);
};

export default {
	find
};
