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
    participants: IUser[];
    rated: number[];
    restaurant: IRestaurant;
}

export interface IUser {
    name: string;
    id: number;
}

export interface IMessage {
    sender: IUser;
    text: string;
    messageId: number;
}

export interface IChatInfo {
    groupId: number;
    messages: IMessage[];
}
