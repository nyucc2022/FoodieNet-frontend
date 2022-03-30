import * as React from 'react';

import { Avatar, Box, Divider, Paper } from '@mui/material';

import Title from '../../../components/title';

export default function Profile() {
    return (<>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ width: 120, height: 120, fontSize: 40, fontWeight: 700, marginTop: 10 }} >H</Avatar>
            <h1>Your Name</h1>
            <Paper elevation={1} sx={{ width: '86%', padding: 3 }}>
                <h3 style={{ margin: 0, marginBottom: 12 }}>Information</h3>
                <Box>Username: <span style={{float: 'right'}}>Something</span></Box>
                <Box>Credit: <span style={{float: 'right'}}>4.4/5</span></Box>

                <Divider sx={{ marginY: 3}} />
                <h3 style={{ margin: 0, marginBottom: 12 }}>Grouping History</h3>
            </Paper>
        </Box>
    </>);
}