import * as React from 'react';

import { Badge, Box, Divider, IconButton, ListItem, ListItemButton, Menu, MenuItem } from '@mui/material';

import { IGroupInfo } from '../../api/interface';
import './index.css';

import More from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { call } from '../../api/utils';

interface IChatCard {
    data: IGroupInfo;
    classNames?: string;
    style?: any;
}

export default function ChatCard({ data, classNames='', style={} }: IChatCard) {
    const archived = !data.active;
    const unread = Math.floor(Math.random());
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = (key: string | null = null) => {
        if (key === 'chat') {
            navigate(`/dashboard/chat/${data.groupId}`);
        } else if (key === 'quit') {
            call('openSnackBar', 'You cannot leave group at this moment.', 'warning');
        }

        setAnchorEl(null);
    };

    const options = [{
        id: 'chat',
        title: 'Open Chat',
    }, {
        id: 'divider',
        title: '',
    }, {
        id: 'quit',
        title: 'Quit Group',
        emphasize: true,
    }];

    return (<ListItem disablePadding className={`chat-card ${classNames}`} sx={{
        border: '1px solid',
        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)'  : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        margin: '10px 20px',
        width: 'calc(100% - 40px)',
        ...(archived ? {
            background: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        } : null),
        ...style,
    }}>
        <ListItemButton onClick={() => handleClose('chat')}>
            <Badge color="primary" badgeContent={unread} componentsProps={{
                badge: {
                    style: {
                        marginLeft: -8,
                    }
                }
            }} anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                    <Box component="h4" sx={{ margin: 0 }}>{data.groupName}</Box>
                    <Box sx={{ fontSize: '0.8em', opacity: 0.75 }}>{data.restaurant.name}</Box>
                </Box>
            </Badge>
        </ListItemButton>
        {
            !archived ? (<>
                <IconButton size="large" onClick={handleMenuClick}>
                    <More />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleClose()}
                    PaperProps={{
                        style: {
                            width: '20ch',
                        },
                    }}
                    MenuListProps={{
                        dense: true,
                    }}
                >
                    {options.map((option, i) => option.id === 'divider' ? (<Divider key={i} />) : (
                        <MenuItem
                            key={i}
                            onClick={() => handleClose(option.id)}
                            sx={option.emphasize ? {
                                color: '#ff3535',
                                fontWeight: 600,
                            } : {}}
                        >
                            {option.title}
                        </MenuItem>
                    ))}
                </Menu>
            </>) : null
        }
    </ListItem>);
}