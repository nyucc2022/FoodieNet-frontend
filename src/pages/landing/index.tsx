import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import BaseContainer from '../../components/baseContainer';

export default function Landing() {
    return (<BaseContainer style={{ background: 'black' }}>
        <Box component="span" sx={{ display: 'flex', p: 2, marginTop: 25, width: '100%', justifyContent: 'center' }}>
            <Typography component="div">
            <Box sx={{ fontSize: 'h3.fontSize', m: 1, color: 'white', fontFamily: 'Ubuntu' }}>FoodieNet</Box>
            </Typography>
        </Box>
        <Box component="span" sx={{ display: 'flex', p: 2, marginTop: 25, width: '100%', justifyContent: 'center' }}>
            <Button sx={{ border: '1px dashed grey', padding: '10px 28px' }} component={Link} to="/dashboard/explore">Explore Now</Button>
        </Box>
    </BaseContainer>);
}