import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './plugin-id';
import Initializer from './components/initializer';
import getTrad from './utils/get-trad';
import PluginIcon from './components/plugin-icon';

const name = pluginPkg.strapi.name;

export default {
	register(app: any) {
		app.registerPlugin({
			id: pluginId,
			initializer: Initializer,
			isReady: false,
			name
		});

		app.customFields.register({
			pluginId,
			name: 'internal-link',
			type: 'json',
			default: {
				sourceContentTypeUid: null,
				sourceContentTypeId: null,
				sourceFieldName: null,
				targetContentTypeUid: null,
				targetContentTypeId: null
			},
			intlLabel: {
				id: getTrad('internal-link.label'),
				defaultMessage: 'Internal Link'
			},
			intlDescription: {
				id: getTrad('internal-link.description'),
				defaultMessage: 'Description'
			},
			icon: PluginIcon,
			components: {
				Input: async () => import(/* webpackChunkName: "internal-links" */ './components/input')
			},
			options: {
				base: [
					{
						sectionTitle: null,
						items: [
							{
								intlLabel: {
									id: getTrad('internal-link.options.base.title'),
									defaultMessage: 'Title'
								},
								name: 'options.title',
								description: {
									id: getTrad('internal-link.options.base.title.description'),
									defaultMessage: 'Select the name of the title field'
								},
								type: 'text',
								defaultValue: 'title'
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.base.slug'),
									defaultMessage: 'Slug'
								},
								name: 'options.slug',
								description: {
									id: getTrad('internal-link.options.base.slug.description'),
									defaultMessage: 'Select the name of the slug field'
								},
								type: 'text',
								defaultValue: 'slug'
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.base.noTitle'),
									defaultMessage: 'Disable link text'
								},
								name: 'options.noTitle',
								description: {
									id: getTrad('internal-link.options.base.noTitle.description'),
									defaultMessage: 'Enable this to hide the link text field'
								},
								type: 'checkbox',
								defaultValue: false
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.externalApi.enable'),
									defaultMessage: 'Enable external API source'
								},
								name: 'options.externalApi.enabled',
								description: {
									id: getTrad('internal-link.options.externalApi.enable.description'),
									defaultMessage: 'Enable this to connect with an external API'
								},
								type: 'checkbox',
								defaultValue: false
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.externalApi.tabName'),
									defaultMessage: 'Set tab name for external API source'
								},
								name: 'options.externalApi.tabName',
								description: {
									id: getTrad('internal-link.options.externalApi.enable.tabName'),
									defaultMessage: '(Optional) Set tab name for external API source'
								},
								type: 'text',
								defaultValue: ''
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.source.options'),
									defaultMessage: 'External API Source'
								},
								name: 'options.externalApi.apiUrl',
								description: {
									id: getTrad('internal-link.options.source.options.description'),
									defaultMessage: 'Select the name of the slug field'
								},
								type: 'text',
								defaultValue: ''
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.source.label.mapping'),
									defaultMessage: 'Label from API'
								},
								name: 'options.externalApi.labelPath',
								description: {
									id: getTrad('internal-link.options.source.label.mapping.description'),
									defaultMessage: 'Select the label to be mapped from the API'
								},
								type: 'text',
								defaultValue: ''
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.source.value.mapping'),
									defaultMessage: 'Value from API'
								},
								name: 'options.externalApi.valuePath',
								description: {
									id: getTrad('internal-link.options.source.value.mapping.description'),
									defaultMessage: 'Select the value to be mapped from the API'
								},
								type: 'text',
								defaultValue: ''
							},
							{
								intlLabel: {
									id: getTrad('internal-link.options.source.additionalLabel.mapping'),
									defaultMessage: 'Optional additional label to map from API'
								},
								name: 'options.externalApi.labelAdditionPath',
								description: {
									id: getTrad('internal-link.options.source.value.additionalLabel.description'),
									defaultMessage: 'Select the additional label to be mapped from the API'
								},
								type: 'text',
								defaultValue: ''
							}
						]
					}
				],
				advanced: [
					{
						sectionTitle: null,
						items: [
							{
								name: 'options.link-regex',
								type: 'text',
								intlLabel: {
									id: getTrad('form.attribute.item.text.regex'),
									defaultMessage: 'RegExp pattern'
								},
								description: {
									id: getTrad('form.attribute.item.text.regex.description'),
									defaultMessage: 'The text of the regular expression'
								}
							}
						]
					},
					{
						sectionTitle: {
							id: 'global.settings',
							defaultMessage: 'Settings'
						},
						items: [
							{
								name: 'required',
								type: 'checkbox',
								intlLabel: {
									id: getTrad('color-picker.options.advanced.requiredField'),
									defaultMessage: 'Required field'
								},
								description: {
									id: getTrad('color-picker.options.advanced.requiredField.description'),
									defaultMessage: "You won't be able to create an entry if this field is empty"
								}
							}
						]
					}
				]
			}
		});
	},

	bootstrap(app: any) {},

	async registerTrads(app: any) {
		const { locales } = app;

		const importedTrads = await Promise.all(
			locales.map((locale: string) => {
				return import(`./translations/${locale}.json`)
					.then(({ default: data }) => {
						return {
							data: prefixPluginTranslations(data, pluginId),
							locale
						};
					})
					.catch(() => {
						return {
							data: {},
							locale
						};
					});
			})
		);

		return Promise.resolve(importedTrads);
	}
};
