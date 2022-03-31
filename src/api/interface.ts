export interface IRestaurant {
    id: string;
    cuisine: string;
    name: string;
    address: string;
    zipCode: number;
    image: string;
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

export interface ISearchOptions {
    timeRange?: [Date, Date];
    creditRange?: [number, number];
    sizeRange?: [number, number];
    distance?: number;
    cuisine?: string;
    keyword?: string;
}
