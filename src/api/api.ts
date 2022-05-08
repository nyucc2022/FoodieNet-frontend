import { currentUser, post } from './amplify';
import * as Interface from './interface';
import { call, choose } from './utils';

export const getMe = (): Interface.IUser => {
    const username = currentUser()?.username || '';
    return {
        id: username,
        name: username,
    };
}

export const isMe = (user?: Interface.IUser): boolean => {
    return getMe().id === user?.id;
}

export const request = async <T=any>(endpoint: string, payload: any): Promise<T | null> => {
    try {
        return await post(endpoint, payload);
    } catch(err) {
        console.error(err);
        call('openSnackBar', 'Cannot fetch api, please check your network', 'error');
        return null;
    }
}

// TODO: mock data
export const getChatGroups = async (): Promise<Interface.IGroupInfo[]> => {
    return Promise.all(Array(25).fill(0).map((_, i) => getChatGroupById(i)));
}

export const getChatGroupById = async (groupId: number): Promise<Interface.IGroupInfo> => {
    return {
        groupId,
        state: groupId % 2 ? 'completed' : 'inprogress',
        groupName: `Random Group ${groupId}`,
        totalParticipants: 8,
        currentParticipants: 8,
        rated: [],
        participants: await getGroupUsers(groupId),
        restaurant: {
            id: genRandomWords(1),
            name: `${genRandomWords(2)} Restaurant`,
            cuisine: 'Japanese',
            address: '5 MetroTech Center',
            zipCode: 11201,
            image: '',
        },
    };
}

export const searchGroup = async (options?: Interface.ISearchOptions): Promise<Interface.IGroupInfo[]> => {
    return Promise.all(Array(20).fill(0).map((_, i) => getChatGroupById(i)));
}

export const searchRestaurant = async (keyword: string): Promise<Interface.IRestaurant[]> => {
    return searchGroup({ keyword }).then(x => x.map(c => c.restaurant));
}

const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
export const genRandomWords = (length: number) => {
    let words = "";
    for (let i = 0; i < 2 + Math.floor(Math.random() * (length - 2)); ++i) {
        if (words) words += ' ';
        const wordLength = 4 + Math.floor(Math.random() * 6);
        for (let j = 0; j < wordLength; ++j) {
            words += choose(chars);
        }
    }
    return words;
}

const users = ['Self', 'Sam', 'Jack', 'Peter', 'Alex'];

// TODO: mock data
export const getMessages = async (groupId: number): Promise<Interface.IChatInfo> => {
    return {
        groupId,
        messages: Array(25).fill(0).map(() => choose(users)).map((sender, i) => ({
            sender: {
                name: sender,
                id: sender,
            },
            text: genRandomWords(12),
            messageId: 1+i,
        })),
    }
}

export const sendMessage = async (groupId: number, message: string): Promise<any> => {
    return await request("/sendmessages", {
        groupId, message,
    });
}

// TODO: mock data
export const getGroupUsers = async (groupId: number): Promise<Interface.IUser[]> => {
    return users.map((u, i) => ({
        id: u,
        name: u,
    }));
}