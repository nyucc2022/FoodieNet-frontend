import * as React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, matchRoutes, Route, Routes } from 'react-router-dom';

import BottomNavigation from '../../components/bottomNavigation';
import BaseContainer from '../../components/baseContainer';

import Explore from './explore';
import Management from './management';
import Profile from './profile';

export default function Dashboard() {
    const [tag, setTag] = useState('management');
    const navigate = useNavigate();
    const location = useLocation();

    const matches = matchRoutes([{ path: '/dashboard/:tag' }], location);
    const urlTag = matches ? matches[0].params.tag : '';
    
    useEffect(() => {
        if (urlTag !== tag) {
            setTag(urlTag);
        }
    }, []);

    const changeHandler = newTag => {
        setTag(newTag);
        navigate(`/dashboard/${newTag}`);
    }

    return (<BaseContainer style={{
        display: 'flex',
        flexDirection: 'column',
    }}>
        <div style={{
            flex: '1',
            overflow: 'scroll',

        }}>
            <Routes>
                <Route path="/explore" element={<Explore />} />
                <Route path="/management" element={<Management />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
        <BottomNavigation currentActive={tag} changeHandler={changeHandler} />
    </BaseContainer>)
}