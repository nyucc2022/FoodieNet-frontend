import * as Interface from './interface';

export const choose = <T>(list: T[] | string) => {
    return list[Math.floor(Math.random() * list.length)];
}

// TODO: mock data
export const getChatGroups = async (): Promise<Interface.IGroupInfo[]> => {
    return Array(25).fill(0).map((_, i) => ({
        groupId: i,
        state: Math.random() < 0.5 ? 'completed' : 'inprogress',
        groupName: `Random Group ${i+1}`,
        totalParticipants: 8,
        currentParticipants: 8,
        rated: [],
        restaurant: {
            name: 'Some Restaurant',
            address: '5 MetroTech Center',
            zipCode: 11201,
        },
    }));
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

// TODO: mock data
export const getMessages = async (groupId: number): Promise<Interface.IChatInfo> => {
    const users = ['Sam', 'Jack', 'Self', 'Peter', 'Alex'];
    return {
        groupId,
        messages: Array(25).fill(0).map(() => choose(users)).map((sender, i) => ({
            sender,
            text: genRandomWords(12),
            messageId: 1+i,
            isMe: sender === 'Self',
        })),
    }
}