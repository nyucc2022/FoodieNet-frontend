import { Send } from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import * as React from 'react';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';
import { getChatGroupById, getMessages, isMe as isMeApi, sleep } from '../../../api/api';
import { IChatInfo, IGroupInfo } from '../../../api/interface';
import AppContext from '../../../api/state';

import Title from '../../../components/title';
import RatingDialog from './rating';

let init = 0;
export default function ChatRoom() {
    const navigate = useNavigate();
    const location = useLocation();

    const matches = matchRoutes([{ path: '/dashboard/chat/:groupId' }], location);
    const groupId = parseInt(matches?.[0].params.groupId!, 10) || 0;

    const ctx = React.useContext(AppContext);
    const [input, setInput] = React.useState<string>('');
    const [data, setData] = React.useState<IChatInfo | null>(null);
    const [groupData, setGroupData] = React.useState<IGroupInfo | null>(null);
    const [ratingOpen, setRatingOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        (async () => {
            ctx.setBackDropStatus(true);
            await sleep(1000);
            const groupData = await getChatGroupById(groupId);
            setData(await getMessages(groupId));
            setGroupData(groupData);
            setRatingOpen(groupData?.state === 'completed' && !groupData?.rated?.includes(0));
            ctx.setBackDropStatus(false);
        })();
    // eslint-disable-next-line
    }, [groupId]);

    React.useEffect(() => {
        init += 1;
        if (init <= 2) {
            return;
        }
        toBottom();
    // eslint-disable-next-line
    }, [data]);
    
    const titleRef = React.useRef<HTMLDivElement>(null);
    const toBottom = () => {
        titleRef?.current?.parentElement && (titleRef.current.parentElement.scrollTop = 1000000);
    }

    const handleSendClick = () => {
        if (input) {
            data?.messages.push({
                messageId: Date.now(),
                sender: {
                    id: 0,
                    name: 'Self',
                },
                text: input,
            });
            setData({...data} as IChatInfo);
            setInput('');
        }
    }

    const handleRateClose = async (data: { [name: number]: number } | null) => {
        setRatingOpen(false);
        if (!data) {
            navigate(`/dashboard/management`);
        } else {
            // TODO: submit rate
            ctx.setBackDropStatus(true);
            await sleep(1000);
            ctx.setBackDropStatus(false);
        }
    }

    let lastUserId: number = -1;

    return (<>
        <Title innerRef={titleRef}>{`ChatRoom: ${groupId}`}</Title>
        <Box sx={{ padding: 2, marginTop: -2, paddingBottom: '60px', display: 'flex', flexDirection: 'column' }}>
            {data?.messages.map(msg => {
                const isMe = isMeApi(msg.sender);
                const sameUser = lastUserId === msg.sender.id;
                lastUserId = msg.sender.id;

                return (<Box
                    key={msg.messageId}
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
                    {!sameUser ?
                        (<Box component="span" sx={{
                            marginLeft: 1,
                            marginBottom: 0.3,
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontSize: 12,
                            fontWeight: 600
                        }}>{msg.sender.name}</Box>) : null}
                    <Box sx={{
                        background: isMe ? 'rgb(46, 125, 50)' : '#556cd6',
                        borderRadius: '16px',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '14px',
                    }}>
                        {msg.text}
                    </Box>
                </Box>)
            }) || null}
        </Box>
        <Box sx={{ display: 'flex', padding: 1, paddingLeft: 2, paddingRight: 2, position: 'fixed', left: 0, width: '100%', bottom: 55, background: 'white', zIndex: 2 }}>
            <TextField
                sx={{ flex: 1 }}
                size="small"
                placeholder="Text Messages"
                value={input}
                onChange={ele => setInput(ele.target.value)}
                onKeyUp={ele => ele.key === 'Enter' && handleSendClick()}
            />
            <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" size="small" onClick={handleSendClick} disabled={!input}>
                <Send />
            </Button>
        </Box>
        <RatingDialog
            open={ratingOpen}
            users={groupData?.participants || []}
            handleClose={handleRateClose}
        />
    </>);
}