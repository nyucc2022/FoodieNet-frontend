export interface IRestaurant {
    id: string;
    name: string;
    cuisine: string;
    address: string;
    zipcode: number;
    longitude?: number;
    latitude?: number;
    image: string;
}

export interface ICreateGroup {
    groupName: string;
    totalSize: number;
    startTime: number;
    restaurantId: string;
}

export interface IGroupInfo {
    groupId: string;
    groupName: string;
    ownerName: string;

    startTime: Date;
    state: 'notstart' | 'inprogress' | 'completed' | 'done';
    
    totalSize: number;
    currentSize: number;

    groupUsernameList: string[];
    reviewedUserList: string[];
    currentGroupCredit: number;
    status: number;
    statusChangeTime: string;

    restaurant: IRestaurant;
}

export interface IUser {
    username: string;
    email?: string;
}

export interface IUserProfile extends IUser {
    ratingtotal: number;
    ratingtime: number;
    rating: number;
}

export interface IMessage {
    groupid: string;
    message: string;
    messageid: number;
    username: string;
}

export interface ISearchOptions {
    startTimeRange?: [Date, Date];
    groupCreditRange?: [number, number];
    sizeRange?: [number, number];
    distanceRange?: [number, number];
    cuisineTypeList?: string[];
    keyword?: string;

    // get by group id
    groupId?: string;

    // get by user
    myGroupFlag?: number;
}
