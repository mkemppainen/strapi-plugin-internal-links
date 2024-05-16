import React, { useState, useLayoutEffect, useEffect, ChangeEvent } from 'react';
import * as yup from 'yup';
import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl';
import { ReactSelect } from '@strapi/helper-plugin';
import {
	Alert,
	Stack,
	Button,
	Field,
	FieldError,
	FieldInput,
	Tabs,
	Tab,
	TabGroup,
	TabPanels,
	TabPanel,
	Box
} from '@strapi/design-system';
import Option from './option';
import useContentTypeOptions, { IContentTypeOption } from './hooks/use-content-type-options';
import usePageOptions from './hooks/use-page-options';
import getTrad from '../../utils/get-trad';
import { INTERNAL_LINK_TYPE } from '../factory';
import { IUseInternalLinkInputReturn } from '../input/use-internal-link-input';
import usePlatformOptions from './hooks/use-platform-options';
import { PageSearch } from './page-select';
import { Platform } from '../../api/platform';
import { IInternalLinkAttribute } from '..';
import { useGetConfig } from '../../api/config';
import { Label } from '../label';

import { ExternalSourceSearch } from './source-select';
import { IReactSelectValue } from '../Combobox';

interface IProps extends Omit<IUseInternalLinkInputReturn, 'initialLink' | 'isInitialData' | 'resetInternalLink'> {
	attributeOptions?: IInternalLinkAttribute['options'];
	shouldShowTitle?: boolean;
}

const InternalLinkForm = ({
	link,
	setLink,
	errors,
	setErrors,
	attributeOptions,
	shouldShowTitle
}: IProps): JSX.Element => {
	const { formatMessage } = useIntl();
	const { data: pluginConfig, isLoading: isLoadingConfig } = useGetConfig({});
	const useSinglePageType = !!pluginConfig?.useSinglePageType || pluginConfig?.pageBuilder?.enabled;
	const noUrlValidation = pluginConfig?.noUrlValidation;
	const pageBuilderEnabled = pluginConfig?.pageBuilder?.enabled;
	const externalSource = pluginConfig?.externalSource?.enabled;

	// More information including tests: https://regexr.com/7p9qh
	const defaultUrlRegex = new RegExp(
		/(^https?:\/\/(www.)?[a-zA-Z0-9]{1,}.[^s]{2,}((\/[a-zA-Z0-9\-\_\=\?\%\&\#]{1,}){1,})?)\/?$|^mailto:[\w-\. +]+@([\w-]+\.)+[\w-]{2,4}$|^tel:((\+|00(\s|\s?\-\s?)?)[0-9]{2}(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[0-9](((\s|\s?\-\s?)?[0-9]){1,})|^#[a-zA-Z0-9\,\[\]\-\_\=\?\%\&\#]{1,}$/
	);

	const {
		contentType,
		setContentTypeUid,
		contentTypeOptions,
		contentTypeOptionsIsLoading,
		contentTypeOptionsIsFetching
	} = useContentTypeOptions(link.targetContentTypeUid);

	const { page, pageId, setPageId, pageOptionsIsLoading } = usePageOptions(contentType, link.targetContentTypeId);
	const { platform, setPlatformId, platformOptions, platformOptionsIsLoading, platformOptionsIsFetching } =
		usePlatformOptions({ page, pageOptionsIsLoading });
	const [isExternalTab, setIsExternalTab] = useState<boolean>(link.type === 'external');
	const [isSourceTab, setIsSourceTab] = useState<boolean>(link.type === 'source');
	const translationLinkKey = !isExternalTab ? 'generated-link' : 'link';

	useEffect(() => {
		if (pluginConfig && useSinglePageType) {
			setContentTypeUid(pluginConfig.pageBuilder?.pageUid || pluginConfig.useSinglePageType);
		}
	}, [pluginConfig]);

	const onContentTypeChange = (value: IContentTypeOption) => {
		setPageId(undefined);
		setContentTypeUid(value.uid);
	};

	const onPageChange = (id?: number, path?: string, domain?: string) => {
		if (!contentType) return;

		setPageId(id);
		setLink((previousValue) => ({
			...previousValue,
			targetContentTypeUid: id ? contentType.uid : '',
			targetContentTypeId: id || null,
			url: [domain, path].filter(Boolean).join('/')
		}));
	};

	const onSourceChange = (props: IReactSelectValue) => {
		if (!props) {
			setLink((previousValue) => ({
				...previousValue,
				externalSourceValue: '',
				url: ''
			}));
			return;
		}
		setLink((previousValue) => ({
			...previousValue,
			externalSourceValue: props ? props.value : '',
			url: props.value
		}));
	};

	const onLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (link.targetContentTypeUid) {
			event.preventDefault;
			setErrors((previousValue) => ({
				...previousValue,
				link: formatMessage({
					id: getTrad('internal-link.form.link.placeholder')
				})
			}));
		} else {
			setLink((value) => ({ ...value, url: event.target.value }));
		}

		setErrors((previousValue) => ({
			...previousValue,
			url: undefined
		}));
	};

	const onLinkBlur = async (event: ChangeEvent<HTMLInputElement>) => {
		const linkRegex = attributeOptions?.['link-regex'];
		const regexObject = linkRegex ? new RegExp(linkRegex) : defaultUrlRegex;
		const newValue = event.target.value;
		const urlSchema = yup.string().required().matches(regexObject);

		if (noUrlValidation) {
			return;
		}

		if (newValue) {
			try {
				await urlSchema.validate(event.target.value);
				setErrors((previousValue) => ({
					...previousValue,
					url: undefined
				}));
			} catch {
				setErrors((previousValue) => ({
					...previousValue,
					url: formatMessage({
						id: getTrad(`internal-link.form.link.error`)
					})
				}));
			}
		} else {
			setErrors((previousValue) => ({
				...previousValue,
				url: formatMessage({
					id: getTrad(`internal-link.form.link.placeholder`)
				})
			}));
		}
	};

	const onReset = () => {
		setContentTypeUid(undefined);
		setPageId(undefined);

		setErrors((previousValue) => ({
			...previousValue,
			link: undefined
		}));

		setLink((previousValue) => ({
			...previousValue,
			id: null,
			targetContentTypeUid: '',
			targetContentTypeId: null
		}));
	};

	const getLoadingMessage = () => {
		return formatMessage({
			id: getTrad('internal-link.loading')
		});
	};

	const getNoOptionsMessage = () => {
		return formatMessage({
			id: getTrad('internal-link.empty')
		});
	};

	const onTextBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		const newValue = event.target.value;

		if (newValue) {
			try {
				// If the text doesn't parse as JSON we cannot save the link.
				JSON.parse(JSON.stringify({ text: newValue }));
				setErrors((previousValue) => ({
					...previousValue,
					text: undefined
				}));
			} catch {
				setErrors((previousValue) => ({
					...previousValue,
					text: formatMessage({
						id: getTrad('internal-link.form.text.error')
					})
				}));
			}
		} else {
			setErrors((previousValue) => ({
				...previousValue,
				text: formatMessage({
					id: getTrad('internal-link.form.text.required')
				})
			}));
		}
	};

	const onUrlAdditionBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		const newValue = event.target.value;

		if (newValue) {
			try {
				// If the text doesn't parse as JSON we cannot save the link.
				JSON.parse(JSON.stringify({ text: newValue }));

				const allowedStart = newValue.startsWith('?') || newValue.startsWith('#');

				setErrors((previousValue) => ({
					...previousValue,
					urlAddition: allowedStart ? undefined : formatMessage({ id: getTrad('internal-link.form.urlAddition.error') })
				}));
			} catch {
				setErrors((previousValue) => ({
					...previousValue,

					urlAddition: formatMessage({
						id: getTrad('internal-link.form.urlAddition.error')
					})
				}));
			}
		}
	};

	const onPlatformChange = (value?: Platform) => {
		setPlatformId(value?.id);
		onPageChange();
	};

	const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLink((value) => ({ ...value, text: (event.target satisfies HTMLInputElement).value }));
	};

	const tabChange = (selected: number) => {
		setErrors((previousValue) => ({
			...previousValue,
			link: undefined,
			url: undefined
		}));
		if (selected === 0) {
			setIsExternalTab(false);
			setIsSourceTab(false);
			setLink((value) => ({ ...value, type: INTERNAL_LINK_TYPE.INTERNAL }));
		} else if (selected === 1) {
			setIsExternalTab(true);
			setIsSourceTab(false);
			setLink((value) => ({ ...value, type: INTERNAL_LINK_TYPE.EXTERNAL }));
		} else if (selected === 2) {
			setIsExternalTab(false);
			setIsSourceTab(true);
			setLink((value) => ({ ...value, type: INTERNAL_LINK_TYPE.SOURCE }));
		}
	};

	const onUrlAdditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target satisfies HTMLInputElement).value;

		if (link.url) {
			setLink((v) => ({ ...v, urlAddition: value }));
		}
	};

	useLayoutEffect(() => {
		setIsExternalTab(link.type === 'external');
	}, []);

	useEffect(() => {
		if ((page?.platform?.domain || contentType?.domain) && link?.domain !== page?.platform?.domain) {
			setLink((previousValue) => ({
				...previousValue,
				domain: page?.platform?.domain || contentType?.domain
			}));
		}
	}, [contentType?.domain, page]);

	return (
		<Stack spacing={6}>
			<TabGroup label="Some stuff for the label" id="tabs" onTabChange={(selected: number) => tabChange(selected)}>
				<Tabs>
					<Tab>Internal</Tab>
					<Tab>External</Tab>
					{externalSource && <Tab>Source</Tab>}
				</Tabs>
				<TabPanels>
					{/* This is the first tab */}
					<TabPanel>
						<Box color="neutral800" padding={4} background="neutral0">
							{shouldShowTitle && (
								<Field name="text" id="text" error={errors.text} required>
									<Label>
										{formatMessage({
											id: getTrad('internal-link.form.text')
										})}
									</Label>

									<FieldInput type="text" value={link.text} onChange={onTextChange} onBlur={onTextBlur} required />

									<FieldError />
								</Field>
							)}
							{!isExternalTab && pageBuilderEnabled && platformOptions.length > 1 && (
								<Box paddingTop={4}>
									<Field required>
										<Label>
											{formatMessage({
												id: getTrad('internal-link.form.platform')
											})}
										</Label>

										<ReactSelect
											inputId="platform"
											name="platform"
											value={platform}
											menuPosition="absolute"
											menuPlacement="auto"
											// @ts-ignore Option is of correct type
											components={{ Option }}
											options={platformOptionsIsFetching ? [] : platformOptions}
											isLoading={platformOptionsIsLoading}
											isDisabled={!contentType || platformOptionsIsLoading}
											// @ts-ignore onChange is of correct type
											onChange={onPlatformChange}
											placeholder={
												platformOptionsIsLoading
													? formatMessage({
															id: getTrad('internal-link.loading')
													  })
													: formatMessage({
															id: getTrad('internal-link.form.platform.placeholder')
													  })
											}
											loadingMessage={getLoadingMessage}
											noOptionsMessage={getNoOptionsMessage}
											isSearchable
											// @ts-ignore isClear is of correct type
											isClear
										/>
									</Field>
								</Box>
							)}

							{!isExternalTab && !isLoadingConfig && !useSinglePageType && (
								<Box paddingTop={4}>
									<Field required>
										<Label>
											{formatMessage({
												id: getTrad('internal-link.form.collection')
											})}
										</Label>

										<ReactSelect
											inputId="collection"
											name="collection"
											value={contentType}
											menuPosition="absolute"
											menuPlacement="auto"
											// @ts-ignore Option is of correct type
											components={{ Option }}
											options={contentTypeOptionsIsFetching ? [] : contentTypeOptions}
											isLoading={contentTypeOptionsIsLoading}
											isDisabled={contentTypeOptionsIsLoading}
											// @ts-ignore onChange is of correct type
											onChange={onContentTypeChange}
											placeholder={
												contentTypeOptionsIsLoading
													? formatMessage({
															id: getTrad('internal-link.loading')
													  })
													: formatMessage({
															id: getTrad('internal-link.form.collection.placeholder')
													  })
											}
											loadingMessage={getLoadingMessage}
											noOptionsMessage={getNoOptionsMessage}
											isSearchable
											// @ts-ignore isClear is of correct type
											isClear
										/>
									</Field>
								</Box>
							)}

							<Box paddingTop={4}>
								{!isExternalTab && (
									<PageSearch
										selectedId={pageId}
										uid={contentType?.uid}
										platformTitle={pageBuilderEnabled ? platform?.label : undefined}
										onChange={(value) => onPageChange(value?.id, value?.path, value?.platform?.domain)}
										pluginConfig={pluginConfig}
										attributeOptions={attributeOptions}
									/>
								)}
							</Box>

							{pluginConfig?.enableUrlAddition && !isExternalTab && (
								<Box paddingTop={4}>
									<Field name="urlAddition" id="urlAddition" error={errors.urlAddition}>
										<Label>
											{formatMessage({
												id: getTrad('internal-link.form.urlAddition')
											})}
										</Label>

										<FieldInput
											type="text"
											value={link?.urlAddition}
											onChange={onUrlAdditionChange}
											disabled={pageOptionsIsLoading || !link?.domain}
											onBlur={onUrlAdditionBlur}
										/>

										<FieldError />
									</Field>
								</Box>
							)}
						</Box>
					</TabPanel>
					{/* This is the second tab */}
					<TabPanel>
						<Box color="neutral800" padding={4} background="neutral0">
							{shouldShowTitle && (
								<Field name="text" id="text" error={errors.text} required>
									<Label>
										{formatMessage({
											id: getTrad('internal-link.form.text')
										})}
									</Label>

									<FieldInput type="text" value={link.text} onChange={onTextChange} onBlur={onTextBlur} required />

									<FieldError />
								</Field>
							)}
							<Box paddingTop={4}>
								<div>
									<Field name="link" id="link" error={errors.url} required>
										<Label>
											{formatMessage({
												id: getTrad(`internal-link.form.${translationLinkKey}`)
											})}
										</Label>

										<FieldInput
											type="text"
											value={link.url}
											onChange={onLinkChange}
											onBlur={onLinkBlur}
											required
											disabled={!isExternalTab}
											placeholder={formatMessage({
												id: getTrad(`internal-link.form.${translationLinkKey}.placeholder`)
											})}
										/>

										<FieldError />
									</Field>
								</div>
							</Box>
						</Box>
					</TabPanel>
					{/* third source tab */}
					<TabPanel>
						<Box color="neutral800" padding={4} background="neutral0">
							{shouldShowTitle && (
								<Field name="text" id="text" error={errors.text} required>
									<Label>
										{formatMessage({
											id: getTrad('internal-link.form.text')
										})}
									</Label>

									<FieldInput type="text" value={link.text} onChange={onTextChange} onBlur={onTextBlur} required />

									<FieldError />
								</Field>
							)}
							<Box paddingTop={4}>
								<ExternalSourceSearch
									selectedValue={link.externalSourceValue}
									onChange={(value) => onSourceChange(value)}
								/>
							</Box>
						</Box>
					</TabPanel>
				</TabPanels>
			</TabGroup>

			{!isExternalTab && pageBuilderEnabled && platformOptions.length > 1 && (
				<Field required>
					<Label>
						{formatMessage({
							id: getTrad('internal-link.form.platform')
						})}
					</Label>

					<ReactSelect
						inputId="platform"
						name="platform"
						value={platform}
						menuPosition="absolute"
						menuPlacement="auto"
						// @ts-ignore Option is of correct type
						components={{ Option }}
						options={platformOptionsIsFetching ? [] : platformOptions}
						isLoading={platformOptionsIsLoading}
						isDisabled={!contentType || platformOptionsIsLoading}
						// @ts-ignore onChange is of correct type
						onChange={onPlatformChange}
						placeholder={
							platformOptionsIsLoading
								? formatMessage({
										id: getTrad('internal-link.loading')
								  })
								: formatMessage({
										id: getTrad('internal-link.form.platform.placeholder')
								  })
						}
						loadingMessage={getLoadingMessage}
						noOptionsMessage={getNoOptionsMessage}
						isSearchable
						// @ts-ignore isClear is of correct type
						isClear
					/>
				</Field>
			)}

			{errors?.link && (
				<Alert
					title={formatMessage({
						id: getTrad('internal-link.form.alert.title')
					})}
					closeLabel={formatMessage({
						id: getTrad('internal-link.form.alert.close')
					})}
					action={
						<Button variant="danger-light" onClick={onReset}>
							{formatMessage({
								id: getTrad('internal-link.form.alert.button')
							})}
						</Button>
					}
					variant="danger"
					onClose={() => {
						setErrors((previousValue) => ({
							...previousValue,
							link: undefined
						}));
					}}
				>
					{formatMessage({
						id: getTrad('internal-link.form.alert.description')
					})}
				</Alert>
			)}
		</Stack>
	);
};

export default InternalLinkForm;
