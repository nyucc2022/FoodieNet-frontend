import * as React from 'react';

import { Avatar, Box, Button, Divider, Paper } from '@mui/material';
import AppContext from '../../../api/state';
import { currentUsername, getUserAttributes } from '../../../api/cognito';
import { call } from '../../../api/utils';

export default function Profile() {
    const ctx = React.useContext(AppContext);

    const [name, setName] = React.useState('Your Name');
    const [email, setEmail] = React.useState('your@email.com');
    const [rating, setRating] = React.useState(5);

    React.useEffect(() => {
        getUserAttributes().then(data => {
            setName(data.username);
            setEmail(data.email);
            setRating(4.4);
        }).catch(err => {
            ctx.openSnackBar?.(`${err}`, 'error');
            ctx.logout?.();
        })
        // eslint-disable-next-line
    }, [currentUsername()]);

    return (<>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ width: 120, height: 120, fontSize: 40, fontWeight: 700, marginTop: 10 }} >{(name || 'A')[0].toLocaleUpperCase()}</Avatar>
            <h1>{name}</h1>
            <Paper elevation={1} sx={{ width: '86%', padding: 3 }}>
                <h3 style={{ margin: 0, marginBottom: 12 }}>Information</h3>
                <Box>Email: <span style={{float: 'right'}}>{email}</span></Box>
                <Box>Credit: <span style={{float: 'right'}}>{rating}/5</span></Box>

                <Divider sx={{ marginY: 3}} />
                <h3 style={{ margin: 0, marginBottom: 12 }}>Grouping History</h3>
            </Paper>

            <Button sx={{ width: '86%', marginTop: 5 }} size="large" variant="contained" color="error" onClick={() => call("logout", true)}>
                Log Me Out
            </Button>
        </Box>
    </>);
}