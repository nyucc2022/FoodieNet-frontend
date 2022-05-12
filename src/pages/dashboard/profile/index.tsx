import * as React from 'react';

import { Avatar, Box, Button, Divider, Paper } from '@mui/material';
import AppContext from '../../../api/state';
import { getUserInfo } from '../../../api/amplify';
import { call } from '../../../api/utils';
import { getProfile } from '../../../api/api';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material';

export default function Profile() {
    const ctx = React.useContext(AppContext);

    const location = useLocation();
    const navigate = useNavigate ();
    const matches = matchRoutes([{ path: '/dashboard/profile/:username' }], location);
    const profileUserName = matches?.[0].params.username || '';

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [rating, setRating] = React.useState(5);

    React.useEffect(() => {
        (async () => {
            try {
                let profileName = profileUserName;
                if (!profileName) {
                    const data = await getUserInfo();
                    if (!data) {
                        throw new Error('User not logged in.');
                    }
                    setName(data.username);
                    setEmail(data.attributes.email);
                    profileName = data.username;
                }
                const profile = await getProfile(profileName);
                setRating(profile.rating || 0);
                if (profileUserName) {
                    setName(profile.username);
                    setEmail(profile.email || 'N/A');
                }
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
            {
                profileUserName
                ? null
                : <Box sx={{ width: 40, height: 40, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', left: 20, top: 20 }} onClick={() => navigate(-1)}><ArrowBack /></Box>
            }
            <Avatar sx={{ width: 120, height: 120, fontSize: 40, fontWeight: 700, marginTop: 10 }} >{(name || ' ')[0].toLocaleUpperCase()}</Avatar>
            <h1>{name || 'N/A'}</h1>
            <Paper elevation={1} sx={{ width: '86%', padding: 3 }}>
                <h3 style={{ margin: 0, marginBottom: 12 }}>User Information</h3>
                <Box>Username: <span style={{float: 'right'}}>{name || 'N/A'}</span></Box>
                <Box>Email: <span style={{float: 'right'}}>{email || 'N/A'}</span></Box>

                <Divider sx={{ marginY: 3}} />
                <h3 style={{ margin: 0, marginBottom: 12 }}>Credit Information</h3>
                <Box>Credit: <span style={{float: 'right'}}>{rating}/5</span></Box>
            </Paper>

            {
                profileUserName
                ? null
                : <Button sx={{ width: '86%', marginTop: 5 }} size="large" variant="contained" color="error" onClick={() => call("logout", true)}>
                    Log Me Out
                </Button>
            }
        </Box>
    </>);
}