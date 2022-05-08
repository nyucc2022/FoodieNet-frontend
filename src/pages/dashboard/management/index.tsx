import * as React from 'react';
import { useState, useEffect } from 'react';

import { List, ListSubheader } from '@mui/material';
import Title from '../../../components/title';
import ChatCard from '../../../components/chatCard';

import { getChatGroups } from '../../../api/api';
import { IGroupInfo } from '../../../api/interface';
import AppContext from '../../../api/state';
import { sleep } from '../../../api/utils';

export default function Management() {
    const [data, setData] = useState<IGroupInfo[]>([]);
    const ctx = React.useContext(AppContext);

    useEffect(() => {
        (async () => {
            ctx.setBackDropStatus?.(true);
            await sleep(500);
            setData(await getChatGroups());
            ctx.setBackDropStatus?.(false);
        })();
    // eslint-disable-next-line
    }, []);

    const inProgress = data.filter(item => item.state !== 'completed');
    const archived = data.filter(item => item.state === 'completed');

    return (<>
        <Title>Management</Title>
        <List>
            <ListSubheader sx={{ padding: '0 1.5rem', zIndex: 2}}>{`In Progress`}</ListSubheader>
            {inProgress.map(chatGroup => (
                <ChatCard data={chatGroup} key={chatGroup.groupId} />
            ))}
            <ListSubheader sx={{ padding: '0 1.5rem', zIndex: 2}}>{`Archived`}</ListSubheader>
            {archived.map(chatGroup => (
                <ChatCard data={chatGroup} key={chatGroup.groupId} />
            ))}
        </List>
    </>);
}