import { styled } from '@mui/material';
import { Icon28CameraAddOutline, Icon28Delete } from '@vkontakte/icons';
import { IconButton, Text } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { Flex } from '../../shared';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: 150,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  border: '1px dashed var(--field_border)',
}));

const Img = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8,
}));

const Desc = styled(Text)(() => ({
  color: 'var(--accent)',
  textAlign: 'center',
}));

interface IconUploadProps {
  file?: Blob & { preview?: string }
  onChange: (value: Blob) => void
}

export const IconUpload: React.FC<IconUploadProps> = observer(({ file, onChange }) => {
  const onDrop = (acceptedFiles: Blob[]) => {
    const [file] = acceptedFiles.map((file) => Object.assign(file, {
      preview: URL.createObjectURL(file),
    }));
    onChange(file);
  };

  const resetIcon = async () => {
    onDrop([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  useEffect(() => {
    return () => URL.revokeObjectURL(file?.preview ?? '');
  }, []);

  return (
    <Flex gap={10} alignItems="center">
      <Wrapper {...getRootProps()}>
        {file?.preview && <Img src={file?.preview} width="100%" height="100%" />}
        <Flex h100 justifyContent="center" flexDirection="column">
          <Icon28CameraAddOutline color={'var(--accent)'} />
          <Desc>
            Кликните на эту область или перетащите файл
          </Desc>
        </Flex>
        <input {...getInputProps()} />
      </Wrapper>
      {file?.preview && (
      <IconButton onClick={resetIcon}>
        <Icon28Delete color="red" />
      </IconButton>
      )}
    </Flex>
  );
});
