import { Card, CardContent, CardMedia } from '@mui/material';
import { SimpleCell, Spacing, Text, Title } from '@vkontakte/vkui';
import React from 'react';

import { apiService } from '../../../app/services';
import { Content } from '../../../app/types';
import { getImgSrc } from '../../../shared';

interface ContentItemProps {
  content: Content
}

export const ContentItem: React.FC<ContentItemProps> = ({ content }) => {
  return (
    <SimpleCell width="100%" style={{ maxWidth: '100%' }}>
      <Card sx={{ width: '100%', maxWidth: '100%' }}>
        {content.pathToPreview && (
          <CardMedia
            sx={{ height: 140 }}
            image={getImgSrc(content.tokenId, content.nftCollection.collectionAddress, apiService.signature)}
            title="green iguana"
          />
        )}
        <CardContent>
          <Title level="2">
            {content.tokenDescription?.substring(0, 20)}
          </Title>
          <Spacing />
          <Text style={{ whiteSpace: 'initial' }}>
            {content.tokenDescription}
          </Text>
        </CardContent>

        {/* {content.title} */}
        {/* {content.pathToPreview && (
          <img
            src={getImgSrc(content.tokenId, content.nftCollection.collectionAddress, apiService.signature)}
            alt=""
            width={30}
            height={30}
          />
        )} */}
      </Card>
    </SimpleCell>
  );
};
