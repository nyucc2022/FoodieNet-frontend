import { Send } from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import * as React from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import { getMessages } from '../../../api/api';
import { IChatInfo } from '../../../api/interface';

import Title from '../../../components/title';

export default function ChatRoom() {
    const location = useLocation();

    const matches = matchRoutes([{ path: '/dashboard/chat/:groupId' }], location);
    const groupId = parseInt(matches?.[0].params.groupId!, 10) || 0;

    const [input, setInput] = React.useState<string>('');
    const [data, setData] = React.useState<IChatInfo | null>(null);

    React.useEffect(() => {
        (async () => {
            setData(await getMessages(groupId));
        })();
    }, [groupId]);

    React.useEffect(() => {
        toBottom();
    }, [data]);
    
    const titleRef = React.useRef<HTMLDivElement>(null);
    const toBottom = () => {
        titleRef?.current?.parentElement && (titleRef.current.parentElement.scrollTop = 1000000);
    }

    const handleSendClick = () => {
        if (input) {
            data?.messages.push({
                messageId: Date.now(),
                sender: 'Self',
                isMe: true,
                text: input,
            });
            setData({...data} as IChatInfo);
            setInput('');
        }
    }

    let lastUser: string = '';

    return (<>
        <Title innerRef={titleRef}>{`ChatRoom: ${groupId}`}</Title>
        <Box sx={{ padding: 2, marginTop: -2, paddingBottom: '60px', display: 'flex', flexDirection: 'column' }}>
            {data?.messages.map(msg => {
                const sameUser = lastUser === msg.sender;
                lastUser = msg.sender;
                return (<Box
                    key={msg.messageId}
                    sx={{
                        marginTop: sameUser ? 0.25 : 2,
                        display: 'inline-flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: 'max-content',
                        alignSelf: msg.isMe ? 'end' : 'inherit',
                        alignItems: msg.isMe ? 'end' : 'inherit',
                    }}
                >
                    {!sameUser ?
                        (<Box component="span" sx={{
                            marginLeft: 1,
                            marginBottom: 0.3,
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontSize: 12,
                            fontWeight: 600
                        }}>{msg.sender}</Box>) : null}
                    <Box sx={{
                        background: msg.isMe ? 'rgb(46, 125, 50)' : '#556cd6',
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
        <Box sx={{ display: 'flex', padding: 1, paddingLeft: 2, paddingRight: 2, position: 'fixed', left: 0, width: '100%', bottom: 55, background: 'white', zIndex: 1 }}>
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
    </>);
}