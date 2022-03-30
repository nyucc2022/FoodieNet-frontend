import * as React from 'react';

import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import Title from '../../../components/title';

export default function Management() {
    return (<>
        <Title>Management</Title>
        <List>
            <ListSubheader sx={{ padding: '0 1.5rem'}}>{`In Progress`}</ListSubheader>
            {Array(25).fill(0).map((_, i) => (
                <ListItem key={i} sx={{ padding: '0 0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <ListItemButton>
                    <ListItemText primary={`Chat Group ${i+1}`} />
                    </ListItemButton>
                </ListItem>
            ))}
            <ListSubheader sx={{ padding: '0 1.5rem', marginTop: '2rem' }}>{`Archived`}</ListSubheader>
            {Array(25).fill(0).map((_, i) => (
                <ListItem key={i} sx={{ padding: '0 0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <ListItemButton>
                    <ListItemText primary={`Chat Group ${i+1}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </>);
}