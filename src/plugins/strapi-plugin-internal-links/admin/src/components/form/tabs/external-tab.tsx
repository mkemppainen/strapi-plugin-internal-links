import React from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../../utils/get-trad';
import { Label } from '../../label';
import { Field, FieldError, FieldInput, TabPanel, Box } from '@strapi/design-system';
import { IInternalLinkErrors } from '../../input/use-internal-link-input';
import { IInternalLink } from '../../factory';

interface Props {
	link: IInternalLink;
	shouldShowTitle?: boolean;
	isExternalTab?: boolean;
	errors: IInternalLinkErrors;
	onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onTextBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onLinkBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const ExternalTab = ({
	link,
	shouldShowTitle,
	errors,
	onTextBlur,
	onTextChange,
	onLinkBlur,
	onLinkChange
}: Props) => {
	const { formatMessage } = useIntl();

	return (
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
									id: getTrad('internal-link.form.link')
								})}
							</Label>

							<FieldInput
								type="text"
								value={link.url}
								onChange={onLinkChange}
								onBlur={onLinkBlur}
								required
								placeholder={formatMessage({
									id: getTrad('internal-link.form.link.placeholder')
								})}
							/>

							<FieldError />
						</Field>
					</div>
				</Box>
			</Box>
		</TabPanel>
	);
};
