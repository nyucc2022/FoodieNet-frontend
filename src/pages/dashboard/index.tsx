import * as React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, matchRoutes, Route, Routes, Link } from 'react-router-dom';

import BottomNavigation from '../../components/bottomNavigation';
import BaseContainer from '../../components/baseContainer';

import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Explore from './explore';
import Management from './management';
import Profile from './profile';
import CreateGroup from './create';
import ChatRoom from './chatroom';

export default function Dashboard() {
    const [tag, setTag] = useState('explore');
    const navigate = useNavigate();
    const location = useLocation();

    const matches = matchRoutes([{ path: '/dashboard/:tag' }], location);
    const urlTag = matches?.[0].params.tag || '';
    const withInDashboardPage = urlTag && 'explore/management/profile'.includes(urlTag);

    useEffect(() => {
        if (urlTag !== tag) {
            setTag(urlTag);
        }
        // eslint-disable-next-line
    }, [urlTag]);

    const changeHandler = (newTag: string) => {
        setTag(newTag);
        navigate(`/dashboard/${newTag}`);
    }

    return (<>
        <BaseContainer style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                flex: '1',
                overflow: 'auto',

            }}>
                <Routes>
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create" element={<CreateGroup />} />
                    <Route path="/chat/*" element={<ChatRoom />} />
                </Routes>
            </div>
            <BottomNavigation currentActive={tag} changeHandler={changeHandler} />
        </BaseContainer>
        {
            withInDashboardPage ?
                (<Box sx={{ position: 'fixed', right: 30, bottom: 80, zIndex: 2 }}>
                    <Fab color="primary" aria-label="create group" component={Link} to="/dashboard/create">
                        <AddIcon />
                    </Fab>
                </Box>) : null
        }
    </>)
}