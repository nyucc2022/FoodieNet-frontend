import * as React from 'react';

import { Badge, Box, Divider, IconButton, ListItem, ListItemButton, Menu, MenuItem } from '@mui/material';

import { IGroupInfo } from '../../api/interface';
import './index.css';

import More from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

interface IChatCard {
    data: IGroupInfo;
    classNames?: string;
    style?: any;
}

export default function ChatCard({ data, classNames='', style={} }: IChatCard) {
    const archived = data.state === 'completed';
    const unread = Math.floor(Math.random() * (!archived ? 10 : 0));
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = (key: string | null = null) => {
        if (key === 'chat') {
            navigate(`/dashboard/chat/${data.groupId}`);
        }

        setAnchorEl(null);
    };

    const options = [{
        id: 'chat',
        title: 'Open Chat',
    }, {
        id: 'chat2',
        title: 'Open Chat',
    }, {
        id: 'divider',
        title: '',
    }, {
        id: 'quit',
        title: 'Quit Group',
        emphasize: true,
    }];

    return (<ListItem disablePadding className={`chat-card ${classNames}`} style={{
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '5px',
        margin: '10px 20px',
        width: 'calc(100% - 40px)',
        ...(archived ? {
            background: 'rgba(0, 0, 0, 0.05)',
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
                    <Box component="h3" sx={{ margin: 0 }}>{data.groupName}</Box>
                    <Box sx={{ fontSize: '0.8em', color: 'rgba(0, 0, 0, 0.6)' }}>{data.restaurant.name}</Box>
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