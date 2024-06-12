import { Common } from '@strapi/strapi';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import {
	DEFAULT_PAGEBUILDER_COLLECTION,
	DEFAULT_PAGEBUILDER_PATH_FIELD,
	DEFAULT_PAGEBUILDER_PLATFORM_UID
} from '../utils/constants';

const getGlobalConfig = () => {
	const config: Record<string, any> | undefined = strapi.config?.get('plugin.internal-links');

	if (config?.pageBuilder?.enabled) {
		if (!config?.pageBuilder?.pageUid) {
			set(config, 'pageBuilder.pageUid', DEFAULT_PAGEBUILDER_COLLECTION);
		}

		if (!config?.pageBuilder?.pathField) {
			set(config, 'pageBuilder.pathField', DEFAULT_PAGEBUILDER_PATH_FIELD);
		}

		if (!config?.pageBuilder?.platformUid) {
			set(config, 'pageBuilder.platformUid', DEFAULT_PAGEBUILDER_PLATFORM_UID);
		}
	}

	return isEmpty(config) ? null : config;
};
const getContentTypeConfig = (uid: Common.UID.ContentType) => {
	const config = strapi.contentType(uid).attributes.internal_link?.['options']?.['slug'];
	return isEmpty(config) ? null : config;
};

export default {
	getGlobalConfig,
	getContentTypeConfig
};
