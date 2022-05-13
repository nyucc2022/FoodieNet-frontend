import { Box, ButtonBase, Chip, CircularProgress, Divider, IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';
import { debounce } from 'lodash';

import Title from '../../../components/title';
import SearchIcon from '@mui/icons-material/Search'
import { IGroupInfo } from '../../../api/interface';
import { getMe, joinGroup, searchGroups } from '../../../api/api';
import { CreditScore, Group, FoodBank, LocationOn } from '@mui/icons-material';
import AppContext from '../../../api/state';
import PillSelector from '../../../components/pillSelector';
import PillRanger from '../../../components/pillRanger';
import { call } from '../../../api/utils';

let savedParams: any = {};

export default function Explore() {
    const ctx = React.useContext(AppContext);

    const [keyword, setKeyword] = React.useState<string>('');
    const [searchResult, setSearchResult] = React.useState<IGroupInfo[] | null>(null);

    const searchApiWithDebounce = React.useMemo(() => debounce(async () => {
        console.log('Params:', savedParams);
        const restaurants = await searchGroups(savedParams);
        setSearchResult(restaurants || []);
        // eslint-disable-next-line
    }, 200), []);

    const doSearch = async (param: string, params?: any) => {
        setSearchResult(null);
        if (params) {
            savedParams[param] = params;
        } else {
            savedParams['name'] = param;
        }
        searchApiWithDebounce();
    }

    React.useEffect(() => {
        savedParams = {
            name: '',
            cuisineTypeList: [],
            sizeRange: [2, 10],
            distanceRange: '< 10km',
            groupCreditRange: [0, 5],
        };
        searchApiWithDebounce();
    // eslint-disable-next-line
    }, []);

    const handleGroupSelect = async (r: IGroupInfo) => {
        ctx.setBackDropStatus?.(true);
        try {
            const msg = await joinGroup(r.groupId);
            if (msg) {
                ctx.openSnackBar?.(msg, 'success');
                call("navigate", `/dashboard/chat/${r.groupId}`);
            } else {
                throw new Error('Failed to join the group.');
            }
        } catch(err) {
            ctx.openSnackBar?.(`${err}`, 'error');
        }
        ctx.setBackDropStatus?.(false);
    }

    return (<>
        <Title>Explore</Title>
        <Box paddingX={3}>
            <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search a group"
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

            <PillSelector multiple placeholder="Select Cuisine" items={['Native', 'Maxican', 'Japanese', 'Chinese']} onChange={v => doSearch('cuisineTypeList', v)} />
            <PillSelector placeholder="Select Distance" items={['< 1km', '< 3km', '< 5km', '< 10km']} onChange={v => doSearch('distanceRange', v)} />

            <PillRanger tag="Credit" placeholder="Credit Range" ranging={[0, 5]} onChange={v => doSearch('groupCreditRange', v)} />
            <PillRanger tag="People" placeholder="Group Range" ranging={[2, 10]} onChange={v => doSearch('sizeRange', v)} marks={{
                values: [2, 3, 5, 10],
            }}/>
            
            {searchResult?.length || (searchResult === null) ?
                <Divider sx={{ marginY: 2 }}/> : null}
            
            {searchResult === null ?
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingY: 5,
                }}>
                    <CircularProgress color="primary" /> 
                </Box>: null}
            
            {searchResult?.filter(r => {
                return !r.groupUsernameList.includes(getMe().username?.toLocaleLowerCase());
            }).map(r => (<Paper
                key={r.groupId}
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
                    onClick={() => handleGroupSelect(r)}
                >
                    <Box component="h4" sx={{ margin: 0, textAlign: 'left' }}>{r.groupName}</Box>
                    <Box sx={{ marginY: 0.25, textAlign: 'left', fontSize: 12 }}>{r.restaurant.name}</Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 0.5, marginLeft: -0.8, marginBottom: -0.8 }}>
                        <Chip icon={<CreditScore />} label={`${r.currentGroupCredit}`} size="small" color="success" sx={{ margin: 0.5 }} />
                        <Chip icon={<Group />} label={`${r.totalSize}`} size="small" sx={{ margin: 0.5 }} />
                        <Chip icon={<FoodBank />} label={r.restaurant.cuisine} size="small" sx={{ margin: 0.5 }} />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 0.5, marginLeft: -0.8, marginBottom: -0.8 }}>
                        <Chip icon={<LocationOn />} label={`${r.restaurant.address}, ${r.restaurant.zipcode}`} size="small" sx={{ margin: 0.5 }} />
                    </Box>
                    <img style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '30%', objectFit: 'cover' }} alt="restaurant" src={r.restaurant.image} />
                </ButtonBase>
            </Paper>))}
        </Box>
    </>);
}
