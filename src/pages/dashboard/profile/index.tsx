import * as React from 'react';

import { Avatar, Box, Button, Divider, Paper } from '@mui/material';
import AppContext from '../../../api/state';
import { getUserInfo } from '../../../api/amplify';
import { call } from '../../../api/utils';
import { getProfile } from '../../../api/api';

export default function Profile() {
    const ctx = React.useContext(AppContext);

    const [name, setName] = React.useState('Your Name');
    const [email, setEmail] = React.useState('your@email.com');
    const [rating, setRating] = React.useState(5);

    React.useEffect(() => {
        (async () => {
            try {
                const data = await getUserInfo();
                if (!data) {
                    throw new Error('User not logged in.');
                }
                setName(data.username);
                setEmail(data.attributes.email);
                const profile = await getProfile(data.username);
                setRating(profile.rating || 0);
            } catch(err) {
                ctx.openSnackBar?.(`${err}`, 'error');
                ctx.logout?.();
            }
        })();
        // eslint-disable-next-line
    }, []);

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
                <Box>Email: <span style={{float: 'right'}}>{email || 'N/A'}</span></Box>
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