import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
	collectionName: 'admin_permissions';
	info: {
		name: 'Permission';
		description: '';
		singularName: 'permission';
		pluralName: 'permissions';
		displayName: 'Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
		subject: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		properties: Attribute.JSON & Attribute.DefaultTo<{}>;
		conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
		role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminUser extends Schema.CollectionType {
	collectionName: 'admin_users';
	info: {
		name: 'User';
		description: '';
		singularName: 'user';
		pluralName: 'users';
		displayName: 'User';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		firstname: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastname: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		username: Attribute.String;
		email: Attribute.Email &
			Attribute.Required &
			Attribute.Private &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		password: Attribute.Password &
			Attribute.Private &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		resetPasswordToken: Attribute.String & Attribute.Private;
		registrationToken: Attribute.String & Attribute.Private;
		isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
		roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> & Attribute.Private;
		blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
		preferedLanguage: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminRole extends Schema.CollectionType {
	collectionName: 'admin_roles';
	info: {
		name: 'Role';
		description: '';
		singularName: 'role';
		pluralName: 'roles';
		displayName: 'Role';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		code: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String;
		users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
		permissions: Attribute.Relation<'admin::role', 'oneToMany', 'admin::permission'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminApiToken extends Schema.CollectionType {
	collectionName: 'strapi_api_tokens';
	info: {
		name: 'Api Token';
		singularName: 'api-token';
		pluralName: 'api-tokens';
		displayName: 'Api Token';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}> &
			Attribute.DefaultTo<''>;
		type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
			Attribute.Required &
			Attribute.DefaultTo<'read-only'>;
		accessKey: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastUsedAt: Attribute.DateTime;
		permissions: Attribute.Relation<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
		expiresAt: Attribute.DateTime;
		lifespan: Attribute.BigInteger;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
	collectionName: 'strapi_api_token_permissions';
	info: {
		name: 'API Token Permission';
		description: '';
		singularName: 'api-token-permission';
		pluralName: 'api-token-permissions';
		displayName: 'API Token Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		token: Attribute.Relation<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminTransferToken extends Schema.CollectionType {
	collectionName: 'strapi_transfer_tokens';
	info: {
		name: 'Transfer Token';
		singularName: 'transfer-token';
		pluralName: 'transfer-tokens';
		displayName: 'Transfer Token';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}> &
			Attribute.DefaultTo<''>;
		accessKey: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastUsedAt: Attribute.DateTime;
		permissions: Attribute.Relation<'admin::transfer-token', 'oneToMany', 'admin::transfer-token-permission'>;
		expiresAt: Attribute.DateTime;
		lifespan: Attribute.BigInteger;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
	collectionName: 'strapi_transfer_token_permissions';
	info: {
		name: 'Transfer Token Permission';
		description: '';
		singularName: 'transfer-token-permission';
		pluralName: 'transfer-token-permissions';
		displayName: 'Transfer Token Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		token: Attribute.Relation<'admin::transfer-token-permission', 'manyToOne', 'admin::transfer-token'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUploadFile extends Schema.CollectionType {
	collectionName: 'files';
	info: {
		singularName: 'file';
		pluralName: 'files';
		displayName: 'File';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String & Attribute.Required;
		alternativeText: Attribute.String;
		caption: Attribute.String;
		width: Attribute.Integer;
		height: Attribute.Integer;
		formats: Attribute.JSON;
		hash: Attribute.String & Attribute.Required;
		ext: Attribute.String;
		mime: Attribute.String & Attribute.Required;
		size: Attribute.Decimal & Attribute.Required;
		url: Attribute.String & Attribute.Required;
		previewUrl: Attribute.String;
		provider: Attribute.String & Attribute.Required;
		provider_metadata: Attribute.JSON;
		related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
		folder: Attribute.Relation<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> & Attribute.Private;
		folderPath: Attribute.String &
			Attribute.Required &
			Attribute.Private &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUploadFolder extends Schema.CollectionType {
	collectionName: 'upload_folders';
	info: {
		singularName: 'folder';
		pluralName: 'folders';
		displayName: 'Folder';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
		parent: Attribute.Relation<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
		children: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
		files: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
		path: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginInternalLinksInternalLink extends Schema.CollectionType {
	collectionName: 'internal_links';
	info: {
		singularName: 'internal-link';
		pluralName: 'internal-links';
		displayName: 'internal-link';
	};
	options: {
		draftAndPublish: false;
		populateCreatorFields: false;
		removeRestrictedRelations: true;
		comment: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		sourceContentTypeUid: Attribute.String;
		sourceContentTypeId: Attribute.String;
		sourceFieldName: Attribute.String;
		targetContentTypeUid: Attribute.String;
		targetContentTypeId: Attribute.String;
		url: Attribute.String;
		text: Attribute.String;
		type: Attribute.String;
		urlAddition: Attribute.String;
		externalApiValue: Attribute.String;
		externalApiLabel: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::internal-links.internal-link', 'oneToOne', 'admin::user'> &
			Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::internal-links.internal-link', 'oneToOne', 'admin::user'> &
			Attribute.Private;
	};
}

export interface PluginInternalLinksInternalLinkWysiwyg extends Schema.CollectionType {
	collectionName: 'internal_links_wysiwyg';
	info: {
		singularName: 'internal-link-wysiwyg';
		pluralName: 'internal-links-wysiwyg';
		displayName: 'internal-link-wysiwyg';
	};
	options: {
		draftAndPublish: false;
		populateCreatorFields: false;
		removeRestrictedRelations: true;
		comment: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		sourceContentTypeUid: Attribute.String;
		sourceContentTypeId: Attribute.String;
		sourceFieldName: Attribute.String;
		targetContentTypeUid: Attribute.String;
		targetContentTypeId: Attribute.String;
		url: Attribute.String;
		text: Attribute.String;
		type: Attribute.String;
		urlAddition: Attribute.String;
		externalApiValue: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::internal-links.internal-link-wysiwyg', 'oneToOne', 'admin::user'> &
			Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::internal-links.internal-link-wysiwyg', 'oneToOne', 'admin::user'> &
			Attribute.Private;
	};
}

export interface PluginI18NLocale extends Schema.CollectionType {
	collectionName: 'i18n_locale';
	info: {
		singularName: 'locale';
		pluralName: 'locales';
		collectionName: 'locales';
		displayName: 'Locale';
		description: '';
	};
	options: {
		draftAndPublish: false;
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.SetMinMax<{
				min: 1;
				max: 50;
			}>;
		code: Attribute.String & Attribute.Unique;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
	collectionName: 'up_permissions';
	info: {
		name: 'permission';
		description: '';
		singularName: 'permission';
		pluralName: 'permissions';
		displayName: 'Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String & Attribute.Required;
		role: Attribute.Relation<'plugin::users-permissions.permission', 'manyToOne', 'plugin::users-permissions.role'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
			Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
			Attribute.Private;
	};
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
	collectionName: 'up_roles';
	info: {
		name: 'role';
		description: '';
		singularName: 'role';
		pluralName: 'roles';
		displayName: 'Role';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 3;
			}>;
		description: Attribute.String;
		type: Attribute.String & Attribute.Unique;
		permissions: Attribute.Relation<
			'plugin::users-permissions.role',
			'oneToMany',
			'plugin::users-permissions.permission'
		>;
		users: Attribute.Relation<'plugin::users-permissions.role', 'oneToMany', 'plugin::users-permissions.user'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
	collectionName: 'up_users';
	info: {
		name: 'user';
		description: '';
		singularName: 'user';
		pluralName: 'users';
		displayName: 'User';
	};
	options: {
		draftAndPublish: false;
		timestamps: true;
	};
	attributes: {
		username: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 3;
			}>;
		email: Attribute.Email &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		provider: Attribute.String;
		password: Attribute.Password &
			Attribute.Private &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		resetPasswordToken: Attribute.String & Attribute.Private;
		confirmationToken: Attribute.String & Attribute.Private;
		confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
		blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
		role: Attribute.Relation<'plugin::users-permissions.user', 'manyToOne', 'plugin::users-permissions.role'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiPagePage extends Schema.CollectionType {
	collectionName: 'pages';
	info: {
		singularName: 'page';
		pluralName: 'pages';
		displayName: "Pagina's";
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	pluginOptions: {
		i18n: {
			localized: true;
		};
		'internal-links': {
			title: 'title';
			slug: 'path';
		};
	};
	attributes: {
		title: Attribute.String &
			Attribute.Required &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		path: Attribute.String &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		parent: Attribute.Relation<'api::page.page', 'oneToOne', 'api::page.page'>;
		excerpt: Attribute.Text &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		modules: Attribute.DynamicZone<['modules.text', 'modules.link-list']> &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		link: Attribute.JSON &
			Attribute.CustomField<'plugin::internal-links.internal-link', {}> &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		platform: Attribute.Relation<'api::page.page', 'oneToOne', 'api::platform.platform'>;
		wysiwyg: Attribute.RichText &
			Attribute.CustomField<
				'plugin::tiptap.tiptap',
				{
					preset: 'rich';
				}
			> &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> & Attribute.Private;
		localizations: Attribute.Relation<'api::page.page', 'oneToMany', 'api::page.page'>;
		locale: Attribute.String;
	};
}

export interface ApiPlatformPlatform extends Schema.CollectionType {
	collectionName: 'platforms';
	info: {
		singularName: 'platform';
		pluralName: 'platforms';
		displayName: 'Platform';
	};
	options: {
		draftAndPublish: false;
	};
	attributes: {
		title: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		domain: Attribute.String;
		link: Attribute.JSON &
			Attribute.CustomField<
				'plugin::internal-links.internal-link',
				{
					noTitle: true;
				}
			> &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::platform.platform', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::platform.platform', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiPostPost extends Schema.CollectionType {
	collectionName: 'posts';
	info: {
		singularName: 'post';
		pluralName: 'posts';
		displayName: 'Post';
	};
	options: {
		draftAndPublish: true;
	};
	pluginOptions: {
		i18n: {
			localized: true;
		};
		'internal-links': {
			title: 'title';
			slug: 'path';
		};
	};
	attributes: {
		title: Attribute.String &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		path: Attribute.String &
			Attribute.SetPluginOptions<{
				i18n: {
					localized: true;
				};
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::post.post', 'oneToOne', 'admin::user'> & Attribute.Private;
		localizations: Attribute.Relation<'api::post.post', 'oneToMany', 'api::post.post'>;
		locale: Attribute.String;
	};
}

declare module '@strapi/types' {
	export module Shared {
		export interface ContentTypes {
			'admin::permission': AdminPermission;
			'admin::user': AdminUser;
			'admin::role': AdminRole;
			'admin::api-token': AdminApiToken;
			'admin::api-token-permission': AdminApiTokenPermission;
			'admin::transfer-token': AdminTransferToken;
			'admin::transfer-token-permission': AdminTransferTokenPermission;
			'plugin::upload.file': PluginUploadFile;
			'plugin::upload.folder': PluginUploadFolder;
			'plugin::internal-links.internal-link': PluginInternalLinksInternalLink;
			'plugin::internal-links.internal-link-wysiwyg': PluginInternalLinksInternalLinkWysiwyg;
			'plugin::i18n.locale': PluginI18NLocale;
			'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
			'plugin::users-permissions.role': PluginUsersPermissionsRole;
			'plugin::users-permissions.user': PluginUsersPermissionsUser;
			'api::page.page': ApiPagePage;
			'api::platform.platform': ApiPlatformPlatform;
			'api::post.post': ApiPostPost;
		}
	}
}
