import { Box, ButtonBase, Chip, CircularProgress, Divider, IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';

import Title from '../../../components/title';
import SearchIcon from '@mui/icons-material/Search'
import { ICreateGroup, IRestaurant } from '../../../api/interface';
import { createGroup, searchRestaurants } from '../../../api/api';
import { FoodBank, LocationOn } from '@mui/icons-material';
import SetupDialog from './setup';
import AppContext from '../../../api/state';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import PillSelector from '../../../components/pillSelector';

let savedParams: any = {
    cuisine: [],
    name: '',
};

export default function CreateGroup() {
    const navigate = useNavigate();
    const ctx = React.useContext(AppContext);

    const [keyword, setKeyword] = React.useState<string>('');
    const [searchResult, setSearchResult] = React.useState<IRestaurant[] | null>([]);
    const [setupRestaurant, setSetupRestaurant] = React.useState<IRestaurant | null>(null);

    const searchApiWithDebounce = React.useMemo(() => debounce(async (params: any = null) => {
        console.log('Params:', params);
        const restaurants = await searchRestaurants(params);
        setSearchResult((restaurants || []).slice(0, 50));
        // eslint-disable-next-line
    }, 200), []);

    React.useEffect(() => {
        savedParams = {
            cuisine: [],
            name: '',
        };
        setSearchResult(null);
        searchApiWithDebounce(savedParams);
        // eslint-disable-next-line
    }, []);

    const doSearch = async (param: string, params?: any) => {
        setSearchResult(null);
        if (params) {
            savedParams[param] = params;
            param = '';
        } else {
            savedParams['name'] = param;
        }
        searchApiWithDebounce(savedParams);
    }

    const handleRestaurantSelect = (r: IRestaurant) => {
        setSetupRestaurant(r);
    }

    const handleSetupClose = async (data: ICreateGroup | null) => {
        if (data) {
            console.log('Params:', data);
            ctx.setBackDropStatus?.(true);
            const groupId = (await createGroup(data)).groupId;
            if (groupId) {
                setSetupRestaurant(null);
                ctx.openSnackBar?.("Success, Your group is created!", "success");
                navigate(`/dashboard/chat/${groupId}`);
            } else {
                ctx.openSnackBar?.("Error: we have issue creating your group.", "error");
            }
            ctx.setBackDropStatus?.(false);
        } else {
            setSetupRestaurant(null);
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

            <PillSelector multiple placeholder="Select Cuisine" items={['Native', 'Maxican', 'Japanese', 'Chinese']} onChange={v => doSearch('cuisine', v)} />
            <PillSelector placeholder="Select Distance" items={['< 1km', '< 3km', '< 5km', '< 10km']} onChange={v => doSearch('distance', v)} />
            
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
                key={r.rid || (r.name + r.address)}
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
                    <Box component="h4" sx={{ margin: 0, textAlign: 'left' }}>{r.name}</Box>
                    <Box sx={{ marginY: 0.25, textAlign: 'left', fontSize: 12 }}>{r.address}</Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 0.5, marginLeft: -0.8, marginBottom: -0.8 }}>
                        <Chip icon={<FoodBank />} label={r.cuisine} size="small" sx={{ margin: 0.5 }} />
                        <Chip icon={<LocationOn />} label={r.zipcode} size="small" sx={{ margin: 0.5 }} />
                    </Box>
                    <img style={{ position: 'absolute', right: 0, top: 0, height: '100%' }} alt="restaurant" src={r.image} />
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