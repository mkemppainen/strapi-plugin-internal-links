import isEmpty from 'lodash';

export const omitByFalsy = <T>(value: any, obj: T): T | undefined => {
	if (isEmpty(value) && typeof value !== 'number' && value !== true) {
		return undefined;
	}

	return obj;
};
