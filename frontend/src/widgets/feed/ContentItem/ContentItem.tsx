import { Card, CardContent, CardMedia } from '@mui/material';
import { SimpleCell, Spacing, Text, Title } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { apiService } from '../../../app/services';
import { Content } from '../../../app/types';
import { getImgSrc } from '../../../shared';

interface ContentItemProps {
  content?: Content
  onClick?: () => void
}

export const ContentItem: React.FC<ContentItemProps> = observer(({ content, onClick }) => {
  return (
    <>
      <SimpleCell disabled={!onClick} width="100%" style={{ maxWidth: '100%' }} onClick={onClick}>
        <Card sx={{ width: '100%', maxWidth: '100%' }}>
          {content?.pathToPreview && (
          <CardMedia
            sx={{ height: 150 }}
            image={getImgSrc(content?.tokenId, content?.nftCollection.collectionAddress, apiService.signature)}
          />
          )}
          <CardContent>
            <Title level="2">
              {content?.tokenDescription?.substring(0, 20)}
            </Title>
            <Spacing />
            <Text style={{ whiteSpace: 'initial' }}>
              {onClick ? (
                <>
                  {content?.tokenDescription}
                </>
              ) : (
                <>
                  {content?.text}
                </>
              )}
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
    </>
  );
});
