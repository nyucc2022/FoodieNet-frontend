export interface IRestaurant {
    name: string;
    address: string;
    zipCode: number;
}

export interface IGroupInfo {
    groupId: number;
    state: 'completed' | 'inprogress';
    groupName: string;
    totalParticipants: number;
    currentParticipants: number;
    rated: number[];
    restaurant: IRestaurant;
}

export interface IMessage {
    sender: string;
    text: string;
    messageId: number;
    isMe?: boolean;
}

export interface IChatInfo {
    groupId: number;
    messages: IMessage[];
}
