import { Box, ButtonBase, Chip, CircularProgress, Divider, IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';

import Title from '../../../components/title';
import SearchIcon from '@mui/icons-material/Search'
import { IGroupInfo } from '../../../api/interface';
import { searchGroup, sleep } from '../../../api/api';
import { CreditScore, FoodBank, LocationOn } from '@mui/icons-material';
import AppContext from '../../../api/state';

export default function Explore() {
    const ctx = React.useContext(AppContext);

    const [keyword, setKeyword] = React.useState<string>('');
    const [searchResult, setSearchResult] = React.useState<IGroupInfo[] | null>([]);

    const doSearch = async () => {
        setSearchResult(null);
        const restaurants = await searchGroup({
            keyword
        });
        await sleep(500);
        setSearchResult(restaurants);
    }

    React.useEffect(() => {
        doSearch();
    // eslint-disable-next-line
    }, [keyword]);

    const handleGroupSelect = async (r: IGroupInfo) => {
        ctx.setBackDropStatus?.(true);
        await sleep(500);
        ctx.setBackDropStatus?.(false);
        ctx.openSnackBar?.('Your request has been submitted.', 'success');
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
                        <Chip icon={<FoodBank />} label={r.restaurant.cuisine} size="small" sx={{ margin: 0.5 }} />
                        <Chip icon={<LocationOn />} label={"1.5 mi"} size="small" sx={{ margin: 0.5 }} />
                        <Chip icon={<CreditScore />} label={"3.3"} size="small" color="success" sx={{ margin: 0.5 }} />
                    </Box>
                </ButtonBase>
            </Paper>))}
        </Box>
    </>);
}
