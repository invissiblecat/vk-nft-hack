import { Card, CardContent, CardMedia, styled, SxProps } from '@mui/material';
import { Icon12ArrowUpRightOutSquareOutline } from '@vkontakte/icons';
import { Chip, Link, SimpleCell, Spacing, Text, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

import { apiService } from '../../../app/services';
import { Content } from '../../../app/types';
import { getImgSrc } from '../../../shared';

const StyledChip = styled(Chip)({
  transition: 'all 0.2s',
  '& span': {
    color: 'var(--text_link)',
  },
  '&:hover': {
    transform: 'translate(2px, -2px)',
  },
});

const StyledSimpleCell = styled(SimpleCell)(() => ({
  '& .vkuiSimpleCell__children': {
    minWidth: '100%',
  },
}));

interface ContentItemProps {
  content?: Content
  onClick?: () => void
}

export const ContentItem: React.FC<ContentItemProps> = observer(({ content, onClick }) => {
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
    <StyledSimpleCell disabled={!onClick} onClick={onClick}>
      <Card sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }} variant="elevation">
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
              <Link href={content.link} target="_blank">
                <StyledChip value={content.link} removable={false} after={<Icon12ArrowUpRightOutSquareOutline />}>
                  {content.link}
                </StyledChip>
              </Link>
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
      </Card>
    </StyledSimpleCell>
  );
});
