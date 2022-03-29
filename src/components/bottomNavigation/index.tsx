import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import ExploreIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export interface IBottomNavigation {
    currentActive: string;
    changeHandler: any;
}

export default function Navigation({ currentActive, changeHandler }: IBottomNavigation) {
  const handleChange = (event: React.SyntheticEvent, newTag: string) => {
    if (changeHandler && newTag !== currentActive) {
        changeHandler(newTag);
    }
  };

  return (
    <BottomNavigation value={currentActive} onChange={handleChange}>
      <BottomNavigationAction
        label="Explore"
        value="explore"
        icon={<ExploreIcon />}
      />
      <BottomNavigationAction
        label="Management"
        value="management"
        icon={<GroupIcon />}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<AssignmentIndIcon />}
      />
    </BottomNavigation>
  );
}