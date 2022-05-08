import { currentUser, getUser, post } from './amplify';
import * as Interface from './interface';
import { call } from './utils';

export const getMe = (): Interface.IUser => {
    const username = currentUser()?.username || '';
    return { username };
}

export const isMe = (user?: Interface.IUser): boolean => {
    return getMe().username === user?.username;
}

export const request = async <T=any>(endpoint: string, payload: object, should: 'string' | 'number' | 'object' | 'array'): Promise<T> => {
    let data = undefined as any;
    try {
        data = await post(endpoint, payload);
    } catch(err) {
        console.error(err);
        if (await getUser()) {
            call('openSnackBar', 'Cannot fetch api, please check your network.', 'error');
        } else {
            call('openSnackBar', 'User session expired, please log in again.', 'error');
            call('logout');
        }
    }

    const typing = Array.isArray(data) ? 'array' : typeof data;
    if (typing !== should) {
        if (data) {
            console.warn(`Server Responding Error: expect '${should}' but get:`, data)
        }
        switch (should) {
            case 'array':
                data = [];
                break;
            case 'object':
                data = {};
                break;
            case 'string':
                data = '';
                break;
            case 'number':
                data = 0;
                break;
        }
    }
    return data;
}

export const getChatGroupById = async (groupId: string): Promise<Interface.IGroupInfo> => {
    return await request("/getGroup", { groupId }, 'object');
}

export const createGroup = async (params: Interface.ICreateGroup) => {
    return await request<{ groupId: string }>("/creategroup", params, 'object');
}

export const searchGroups = async (options: Interface.ISearchOptions): Promise<Interface.IGroupInfo[]> => {
    return await request("/searchgroup", options, 'array');
}

export const joinGroup = async (groupId: string) => {
    return await request("/joingroup", { groupId, username: '{{@username}}', }, 'string');
}

export const searchRestaurants = async (params: {name: string, cuisine?: string[]}): Promise<Interface.IRestaurant[]> => {
    return await request("/searchrestaurant", params, 'array');
}

export const getMessages = async (groupId: string): Promise<Interface.IChatInfo> => {
    return await request("/getmessages", {
        groupId,
    }, 'object');
}

export const sendMessage = async (groupId: string, message: string): Promise<Interface.IMessage> => {
    return await request("/sendmessages", {
        groupId, message,
    }, 'object');
}

export const rateUser = async (groupId: string, username: string, rate: number) => {
    return await request("/rateuser", {
        groupId, username, rate,
    }, 'object');
}

export const getProfile = async (username: string): Promise<Interface.IUserProfile> => {
    return await request("/getprofile", {
        username,
    }, 'object');
}
