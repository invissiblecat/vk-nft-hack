import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Paper, styled } from '@mui/material';
import { CellButton, FormItem, SimpleCell, Spinner } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';

import { useStores } from '../../../shared';

const StyledPaper = styled(Paper)(() => ({
  backgroundColor: 'var(--background_content,var(--vkui--color_background_content))',
  color: 'var(--text_primary,var(--vkui--color_text_primary))',
  boxShadow: 'none',
}));

interface ApplicationListProps {
  title: string;
  selectedAddresses: string[]
  setSelectedAddresses: (state: string[]) => void;
  addresses: string[];
  request: () => void;
  buttonText: string;
  icon: ReactNode;
}

export const ApplicationListBase: React.FC<ApplicationListProps> = observer(({
  icon,
  title,
  selectedAddresses,
  setSelectedAddresses,
  addresses,
  request,
  buttonText,
}) => {
  const { applicationListStore } = useStores();

  const handleToggle = (value: string) => () => {
    const currentIndex = selectedAddresses.indexOf(value);
    const newChecked = [...selectedAddresses];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedAddresses(newChecked);
  };

  return (
    <>
      <SimpleCell disabled width="100%">
        <FormItem top={title} width="100%">
          <StyledPaper sx={{ width: 550, height: 250, overflow: 'auto' }} variant="outlined">
            <List dense component="div" role="list">
              {addresses.map((value) => (
                <ListItem
                  disabled={applicationListStore.isLoading}
                  key={value}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={selectedAddresses.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': value,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={value} primary={value} />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        </FormItem>
      </SimpleCell>
      <CellButton
        centered
        style={{ background: 'var(--accent)', color: 'white' }}
        disabled={applicationListStore.isLoading || !selectedAddresses.length}
        before={applicationListStore.isLoading ? (
          <Spinner style={{ width: 30, padding: '10px 8px 10px 0' }} />
        ) : (
          icon
        )}
        onClick={request}
      >
        {applicationListStore.isLoading ? 'Загрузка...' : buttonText}
      </CellButton>
    </>

  );
});
