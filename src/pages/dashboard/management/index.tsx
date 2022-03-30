import * as React from 'react';
import { useState, useEffect } from 'react';

import { List, ListSubheader } from '@mui/material';
import Title from '../../../components/title';
import ChatCard from '../../../components/chatCard';

import { getChatGroups } from '../../../api/api';
import { IGroupInfo } from '../../../api/interface';

export default function Management() {

    const [data, setData] = useState<IGroupInfo[]>([]);
    useEffect(() => {
        (async () => {
            setData(await getChatGroups());
        })();
    }, []);

    const inProgress = data.filter(item => item.state !== 'completed');
    const archived = data.filter(item => item.state === 'completed');

    return (<>
        <Title>Management</Title>
        <List>
            <ListSubheader sx={{ padding: '0 1.5rem'}}>{`In Progress`}</ListSubheader>
            {inProgress.map(chatGroup => (
                <ChatCard data={chatGroup} key={chatGroup.groupId} />
            ))}
            <ListSubheader sx={{ padding: '0 1.5rem'}}>{`Archived`}</ListSubheader>
            {archived.map(chatGroup => (
                <ChatCard data={chatGroup} key={chatGroup.groupId} />
            ))}
        </List>
    </>);
}