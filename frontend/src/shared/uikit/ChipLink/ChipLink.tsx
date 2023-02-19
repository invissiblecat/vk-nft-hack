import { styled } from '@mui/material';
import { Icon12ArrowUpRightOutSquareOutline } from '@vkontakte/icons';
import { Chip, Link } from '@vkontakte/vkui';
import React from 'react';

const StyledChip = styled(Chip)({
  transition: 'all 0.2s',
  '& span': {
    color: 'var(--text_link)',
  },
  '&:hover': {
    transform: 'translate(2px, -2px)',
  },
});

interface ChipLinkProps {
  href: string
  external?: boolean
}

export const ChipLink: React.FC<ChipLinkProps> = ({ href, children, external = true }) => {
  return (
    <Link href={href} target={external ? '_blank' : '_self'}>
      <StyledChip value={href} removable={false} after={<Icon12ArrowUpRightOutSquareOutline />}>
        {children}
      </StyledChip>
    </Link>
  );
};
