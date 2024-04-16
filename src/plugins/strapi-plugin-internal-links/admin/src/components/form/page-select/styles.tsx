import styled, { css } from 'styled-components';
import { Box } from '@strapi/design-system';

const CustomOption = styled(Box)`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const CustomOptionSubTitle = styled(Box)`
	${({ theme, disabled }) => css`
		font-size: ${theme.fontSizes[1]};
		color: ${theme.colors.neutral400};
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: calc(100%);
		margin-top: -3px;
	`}
`;

const CustomOptionStatus = styled(Box)`
	background: ${({ theme, publicationState }) =>
		publicationState === 'published' ? theme.colors.success600 : theme.colors.secondary600};
	width: 6px;
	height: 6px;
	border-radius: 100px;
	flex-shrink: 0;
`;

const LocaleSelectWrapper = styled.div`
	max-width: 64px;
`;

export default {
	CustomOptionStatus,
	CustomOption,
	CustomOptionSubTitle,
	LocaleSelectWrapper
};
