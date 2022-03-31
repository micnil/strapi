import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Box } from '@strapi/design-system/Box';
import { KeyboardNavigable } from '@strapi/design-system/KeyboardNavigable';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden';

import { FolderCard, FolderCardBody, FolderCardCheckbox, FolderCardLink } from '../FolderCard';
import { GridColumnSize } from '../../constants';

const GridLayout = styled(Box)`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ size }) => `${GridColumnSize[size]}px`}, 1fr)
  );
  grid-gap: ${({ theme }) => theme.spaces[4]};
`;

export const FolderList = ({ title, folders, size, onSelectFolder, selectedFolders }) => {
  const history = useHistory();

  return (
    <KeyboardNavigable tagName="article">
      {title && (
        <Box paddingTop={2} paddingBottom={2}>
          <Typography as="h2" variant="delta" fontWeight="semiBold">
            {title}
          </Typography>
        </Box>
      )}

      <GridLayout size={size}>
        {folders.map(folder => {
          const isSelected = !!selectedFolders.find(
            currentFolder => currentFolder.id === folder.id
          );
          // TODO: is there a better way to retrieve the plugin base URL?
          const url = `/admin/plugins/upload?parent=${folder.id}`;

          return (
            <FolderCard
              ariaLabel={folder.name}
              id="folder"
              key={`folder-${folder.uuid}`}
              onDoubleClick={() => history.push(url)}
              startAction={
                <FolderCardCheckbox
                  value={isSelected}
                  onChange={() => onSelectFolder({ ...folder, type: 'folder' })}
                />
              }
            >
              <FolderCardBody>
                <FolderCardLink href={url}>
                  <Flex as="h2" direction="column" alignItems="start">
                    <Typography textColor="neutral800" variant="omega" fontWeight="semiBold">
                      {folder.name}
                      <VisuallyHidden>:</VisuallyHidden>
                    </Typography>

                    <Typography as="span" textColor="neutral600" variant="pi">
                      {folder.children.count} folder, {folder.files.count} assets
                    </Typography>
                  </Flex>
                </FolderCardLink>
              </FolderCardBody>
            </FolderCard>
          );
        })}
      </GridLayout>
    </KeyboardNavigable>
  );
};

FolderList.defaultProps = {
  size: 'M',
  selectedFolders: [],
  title: null,
};

FolderList.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  size: PropTypes.oneOf(['S', 'M']),
  selectedFolders: PropTypes.array,
  onSelectFolder: PropTypes.func.isRequired,
  title: PropTypes.string,
};