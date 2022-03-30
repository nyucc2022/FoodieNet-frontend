import { Box, ButtonBase, Chip, CircularProgress, Divider, IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';

import Title from '../../../components/title';
import SearchIcon from '@mui/icons-material/Search'
import { IRestaurant } from '../../../api/interface';
import { searchRestaurant, sleep } from '../../../api/api';
import { FoodBank, LocationOn } from '@mui/icons-material';
import SetupDialog from './setup';
import AppContext from '../../../api/state';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
    const navigate = useNavigate();
    const ctx = React.useContext(AppContext);

    const [keyword, setKeyword] = React.useState<string>('');
    const [searchResult, setSearchResult] = React.useState<IRestaurant[] | null>([]);
    const [setupRestaurant, setSetupRestaurant] = React.useState<IRestaurant | null>(null);

    const doSearch = async (param?: string) => {
        setSearchResult(null);
        const restaurants = await searchRestaurant(param || keyword);
        await sleep(500);
        setSearchResult(restaurants);
    }

    const handleRestaurantSelect = (r: IRestaurant) => {
        setSetupRestaurant(r);
    }

    const handleSetupClose = async (data: { [name: string]: any } | null) => {
        setSetupRestaurant(null);
        if (data) {
            // TODO: submit restaurant group creation
            console.log('create group:', data);
            ctx.setBackDropStatus(true);
            await sleep(1000);
            ctx.setBackDropStatus(false);
            ctx.openSnackBar("Success, Your group is created!", "success");
            navigate('/dashboard/management');
        }
    }

    return (<>
        <Title>Pick a restaurant</Title>
        <Box paddingX={3}>
            <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search a restaurant"
                    inputProps={{ 'aria-label': 'search a restaurant' }}
                    value={keyword}
                    onChange={(event) => {
                        setKeyword(event.target.value);
                        doSearch(event.target.value);
                    }}
                />
                <IconButton sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            
            {searchResult?.length || (searchResult === null) ?
                <Divider sx={{ marginY: 3 }}/> : null}
            
            {searchResult === null ?
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingY: 5,
                }}>
                    <CircularProgress color="primary" /> 
                </Box>: null}
            
            {searchResult?.map(r => (<Paper
                key={r.id}
                sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, }}
                elevation={1}
            >
                <ButtonBase
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        padding: 2
                    }}
                    onClick={() => handleRestaurantSelect(r)}
                >
                    <Box component="h3" sx={{ margin: 0, textAlign: 'left' }}>{r.name}</Box>
                    <Box sx={{ marginY: 0.25, textAlign: 'left' }}>{r.address}</Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 0.5, marginLeft: -0.8, marginBottom: -0.8 }}>
                        <Chip avatar={<FoodBank />} label={r.cuisine} size="small" sx={{ margin: 0.5 }} />
                        <Chip avatar={<LocationOn />} label={"1.5 mi"} size="small" sx={{ margin: 0.5 }} />
                    </Box>
                </ButtonBase>
            </Paper>))}
        </Box>

        <SetupDialog
            open={Boolean(setupRestaurant)}
            restaurant={setupRestaurant!}
            handleClose={handleSetupClose}
        />
    </>);
}