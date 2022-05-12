import { Send } from '@mui/icons-material';
import { Avatar, Box, Button, Link, Paper, TextField } from '@mui/material';
import * as React from 'react';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';
import { getChatGroupById, getMessages, isMe as isMeApi, rateUser, sendMessage } from '../../../api/api';
import { IMessage, IGroupInfo } from '../../../api/interface';
import AppContext from '../../../api/state';
import { call } from '../../../api/utils';

import Title from '../../../components/title';
import RatingDialog from './rating';

let init = 0;
let lastSrollMessageId = '';

const REFRESH = 2000;

const AvatarLink = (username: string, bottomMargin=false) => (<Link key={username} href={`/dashboard/profile/${username}`}>
    <Avatar sx={{
            width: 34, height: 34,
            fontSize: 16, fontWeight: 500,
            mx: 1, ...(bottomMargin ? { mb: 1 } : {}),
        }} >{(username || ' ')[0].toLocaleUpperCase()}
    </Avatar>
</Link>);

export default function ChatRoom() {
    const navigate = useNavigate();
    const location = useLocation();

    const matches = matchRoutes([{ path: '/dashboard/chat/:groupId' }], location);
    const groupId = matches?.[0].params.groupId || '0';

    const ctx = React.useContext(AppContext);
    const [input, setInput] = React.useState<string>('');
    const [data, setData] = React.useState<IMessage[] | null>(null);
    const [groupData, setGroupData] = React.useState<IGroupInfo | null>(null);
    const [ratingOpen, setRatingOpen] = React.useState<boolean>(false);

    const getLastScroll = () => {
        const lastMessage = data?.[(data?.length || 0) - 1] || {} as IMessage;
        return `${groupId}/${lastMessage.messageid}`;
    }

    const fetchMessage = React.useMemo(() => (async (block = false, messageOnly = false) => {
        block && ctx.setBackDropStatus?.(true);
        const messages = await getMessages(groupId);
        setData(messages);
        if (!messageOnly) {
            const groupData = await getChatGroupById(groupId);
            if (!groupData.totalSize) {
                call("openSnackBar", "Cannot get group info, please refresh your page.", "error");
                call("navigate", "/dashboard/management");
            } else {
                setGroupData(groupData);
                setRatingOpen(groupData?.state === 'Rate You Mates');
            }
        }
        block && ctx.setBackDropStatus?.(false);
        // eslint-disable-next-line
    }), [groupId]);

    React.useEffect(() => {
        init = 0;
        lastSrollMessageId = '';
        fetchMessage(true, false);

        const itv = setInterval(() => {
            fetchMessage(false, true);
        }, REFRESH);

        return () => {
            clearInterval(itv);
        }
        // eslint-disable-next-line
    }, [groupId]);

    React.useEffect((...args) => {
        init += 1;
        if (init < 2) {
            return;
        }
        const scrollId = getLastScroll();
        if (lastSrollMessageId !== scrollId) {
            lastSrollMessageId = scrollId;
            toBottom();
        }
    // eslint-disable-next-line
    }, [data]);
    
    const titleRef = React.useRef<HTMLDivElement>(null);
    const toBottom = () => {
        titleRef?.current?.parentElement && (titleRef.current.parentElement.scrollTop = 1000000);
    }

    const handleSendClick = async () => {
        if (input) {
            if (await sendMessage(groupId, input)) {
                await fetchMessage(false, true);
                setInput('');
            } else {
                call("openSnackBar", "Can not send message at this moment, please try again later.", "error")
            }
        }
    }

    const handleRateClose = async (data: { [name: number]: number } | null) => {
        setRatingOpen(false);
        if (!data) {
            navigate(`/dashboard/management`);
        } else {
            ctx.setBackDropStatus?.(true);
            await rateUser(groupId, data);
            ctx.setBackDropStatus?.(false);
        }
    }

    let lastUserId: string = '<N/A>';
    return (<>
        <Title style={{ fontSize: 26 }} innerRef={titleRef}>{`💬 ${groupData?.groupName || 'ChatRoom'}`}</Title>
        <Paper elevation={1} sx={{ marginLeft: '3%', width: '94%', padding: 2 }}>
            <Box sx={{ m: 0.5 }}><b>📝 Progress: <span style={{ color: groupData?.state ? '#2e7d32' : '#ffa400' }}>{groupData?.state}</span></b></Box>
            <Box sx={{ m: 0.5 }}><b>👥 Grouping: <span style={{ color: groupData?.state ? '#2e7d32' : '#ffa400' }}>{groupData?.currentSize}</span>/{groupData?.totalSize}</b></Box>
            <Box sx={{ m: 0.5 }}><b>⏰ Schedule: </b>{new Date(1000 * (groupData?.startTime || (Date.now() / 1000))).toLocaleString()}</Box>
            <Box sx={{ m: 0.5 }}><b>🍚 Restaurant: </b>{groupData?.restaurant?.name} ({groupData?.restaurant?.cuisine})</Box>
            <Box sx={{ m: 0.5 }}><b>🚗 Location: </b><Link href={`https://www.google.com/maps/place/${groupData?.restaurant?.address?.replaceAll?.(' ', '+')},+NY+${groupData?.restaurant?.zipcode}`} target="_blank">{groupData?.restaurant?.address}, {groupData?.restaurant?.zipcode}</Link></Box>
            <Box sx={{ m: 0.5 }}><b>🎉 Participants: </b></Box>
            <Box sx={{ m: 0.5, mt: 1, mb: -0.5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {groupData?.groupUsernameList?.map?.(u => AvatarLink(u, true))}
            </Box>
        </Paper>
        <Box sx={{ padding: 2, marginTop: -2, paddingBottom: '60px', display: 'flex', flexDirection: 'column' }}>
            {(data || []).map((msg: IMessage) => {
                const isMe = isMeApi(msg.username);
                const sameUser = lastUserId === msg.username;
                lastUserId = msg.username;

                return (<Box
                    key={msg.messageid}
                    sx={{
                        marginTop: sameUser ? 0.25 : 2,
                        display: 'inline-flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: 'max-content',
                        alignSelf: isMe ? 'end' : 'inherit',
                        alignItems: isMe ? 'end' : 'inherit',
                    }}
                >
                    <Box component="div" sx={{
                        display: 'flex',
                    }}>
                        {!isMe ?
                            !sameUser
                            ? AvatarLink(msg.username)
                            : <Box sx={{width: 34, height: 34, mx: 1}}/>
                        : null}
                        <Box sx={{
                            background: isMe ? 'rgb(46, 125, 50)' : '#556cd6',
                            borderRadius: '16px',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '14px',
                            wordBreak: 'break-word',
                            ...(!isMe ? {maxWidth: '85%'} : null),
                        }}>
                            {msg.message}
                        </Box>
                    </Box>
                </Box>)
            }) || null}
        </Box>
        <Box sx={{
            display: 'flex', padding: 1, paddingLeft: 2, paddingRight: 2, position: 'fixed', left: 0, width: '100%', bottom: 55, zIndex: 2,
            background: theme => theme.palette.mode === 'dark' ? '#121212' : 'white',
        }}>
            <TextField
                sx={{ flex: 1 }}
                size="small"
                placeholder="Text Messages"
                value={input}
                onChange={ele => setInput(ele.target.value)}
                onKeyUp={ele => ele.key === 'Enter' && handleSendClick()}
                disabled={!groupData?.active}
            />
            <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" size="small" onClick={handleSendClick} disabled={!input}>
                <Send />
            </Button>
        </Box>
        <RatingDialog
            open={ratingOpen}
            usernames={groupData?.groupUsernameList || []}
            handleClose={handleRateClose}
        />
    </>);
}