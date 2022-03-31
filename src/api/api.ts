import * as Interface from './interface';

export const choose = <T>(list: T[] | string) => {
    return list[Math.floor(Math.random() * list.length)];
}

export const sleep = (timeout: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export const getMe = (): Interface.IUser => {
    return {
        id: 0,
        name: 'Self',
    };
}

export const isMe = (user?: Interface.IUser): boolean => {
    return getMe().id === user?.id;
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
                id: users.indexOf(sender),
            },
            text: genRandomWords(12),
            messageId: 1+i,
        })),
    }
}

// TODO: mock data
export const getGroupUsers = async (groupId: number): Promise<Interface.IUser[]> => {
    return users.map((u, i) => ({
        id: i,
        name: u,
    }));
}