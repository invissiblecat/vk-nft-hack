import { Card, CardContent, CardMedia, styled, SxProps } from '@mui/material';
import { Avatar, Banner, SimpleCell, Spacing, Text, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

import { apiService } from '../../../app/services';
import { Content } from '../../../app/types';
import { ChipLink, Flex, getExplorerLink, getImgSrc, getTokenIdLink, useStores, useUserInfo } from '../../../shared';

const StyledBanner = styled(Banner)(() => ({
  padding: 0,
  '& > div': {
    paddingBottom: 4,
    background: 'transparent',
    '&::before': {
      content: 'none',
    },
  },
}));

const StyledSimpleCell = styled(SimpleCell)(() => ({
  '& .vkuiSimpleCell__children': {
    minWidth: '100%',
  },
}));

const StyledCard = styled(Card)(() => ({
  backgroundColor: 'var(--background_content,var(--vkui--color_background_content))',
  color: 'var(--text_primary,var(--vkui--color_text_primary))',
  width: '100%',
  maxWidth: '100%',
  minWidth: '100%',
  boxShadow: 'none',
}));

interface ContentItemProps {
  content?: Content
  onClick?: () => void
}

export const ContentItem: React.FC<ContentItemProps> = observer(({ content, onClick }) => {
  const { userStore } = useStores();

  const userInfo = useUserInfo(content?.nftCollection.ownerId);
  const sx = useMemo<SxProps>(() => {
    if (onClick) return { height: 150 };

    return {
      backgroundSize: 'contain',
      borderRadius: 2,
      width: 'auto',
      height: 400,
      maxHeight: '100%',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    };
  }, [onClick]);

  return (
    <StyledSimpleCell
      disabled={!onClick}
      onClick={onClick}
      style={onClick && {
        border: 'var(--thin-border) solid var(--image_border,var(--vkui--color_image_border_alpha))',
      }}
    >
      {content && (
        <StyledBanner
          before={<Avatar size={68} src={userInfo?.photo_200} />}
          header={userInfo && `Автор: ${userInfo?.first_name} ${userInfo?.last_name}`}
          actions={
            <>
              <Spacing size={8} />
              <Flex gap={4} flexWrap="wrap">
                <ChipLink href={getTokenIdLink(content.nftCollection.collectionAddress, content.tokenId)}>
                  Посмотреть NFT на Bscscan
                </ChipLink>
                <ChipLink href={getExplorerLink(content.txHash)}>
                  Посмотреть транзакцию создания
                </ChipLink>
              </Flex>
            </>
          }
        />
      )}
      <StyledCard>
        {content?.pathToPreview && (
          <CardMedia
            sx={sx}
            image={getImgSrc(content.tokenId, content.nftCollection.collectionAddress, apiService.signature)}
          />
        )}
        <CardContent>
          <Title level="2">
            {content?.title}
          </Title>
          <Spacing />
          {content?.link && (
            <>
              <ChipLink href={content.link}>
                {content.link}
              </ChipLink>
              <Spacing />
            </>
          )}
          <Text style={{ whiteSpace: 'initial' }}>
            {onClick ? (
              content?.tokenDescription
            ) : (
              content?.text || content?.tokenDescription
            )}
          </Text>
        </CardContent>
      </StyledCard>
    </StyledSimpleCell>
  );
});
