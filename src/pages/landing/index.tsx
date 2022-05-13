import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import BaseContainer from '../../components/baseContainer';
import {Stack} from "@mui/material";

export default function Landing() {
    return (<BaseContainer style={{display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
            <Box component="span" sx={{ display: 'flex', p: 2, width: '100%', justifyContent: 'center' }}>
                <Typography component="div">
                <Box sx={{ fontSize: 'h3.fontSize', m: 1, fontFamily: 'Ubuntu' }}>FoodieNet</Box>
                </Typography>
            </Box>

            <Box component="span" sx={{ display: 'flex', p: 2, marginTop: 25, width: '100%', justifyContent: 'center' }}>
                <Stack
                    sx={{ pt: 4 }}
                    direction="column"
                    spacing={4}
                    justifyContent="flex-end"
                >
                    <Button variant="contained" sx={{ padding: '11px 49px' }} component={Link} to="/signin">Sign In</Button>
                    <Button sx={{ border: '2px dashed', borderColor: theme => theme.palette.primary.main, padding: '10px 48px' }} component={Link} to="/signup">Sign Up</Button>
                </Stack>
            </Box>
        </div>
    </BaseContainer>);
}