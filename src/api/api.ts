import { currentUser, getUser, post } from './amplify';
import * as Interface from './interface';
import { assign, call } from './utils';

export const getMe = (): Interface.IUser => {
    const username = currentUser()?.username || '';
    return { username };
}

export const isMe = (user?: string | Interface.IUser): boolean => {
    const me = getMe().username;
    return typeof user === 'string'
        ? me === user
        : me === user?.username;
}

export const request = async <T=any>(endpoint: string, payload: object, should: 'string' | 'number' | 'object' | 'array' | 'boolean'): Promise<T> => {
    let data = undefined as any;
    try {
        data = await post(endpoint, payload);
    } catch(err) {
        if (await getUser()) {
            console.error(err);
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
            case 'boolean':
                data = false;
                break;
        }
    }
    return data;
}

assign("request", request);

export const createGroup = async (params: Interface.ICreateGroup) => {
    return await request<{ groupId: string }>("/creategroup", params, 'object');
}

export const postProcessGroupInfo = (gi: Interface.IGroupInfo): Interface.IGroupInfo => {
    if (!gi) return gi;
    let active = true;
    let state: Interface.IGroupInfo['state'] = 'Grouping Up';
    if (gi.status) {
        state = 'Ready To Go!';
        if (parseInt(gi.startTime as any, 10) * 1000 + 2 * 60 * 60 * 1000 >= Date.now()) {
            active = false;
            state = 'Rate You Mates';
            if (gi.reviewedUserList.includes(getMe().username)) {
                state = 'Done';
            }
        }
    }

    gi.active = active;
    gi.state = state;

    return gi;
}

export const searchGroups = async (options: Interface.ISearchOptions): Promise<Interface.IGroupInfo[]> => {
    return (await request("/searchgroup", options, 'array')).map(postProcessGroupInfo);
}

export const getChatGroupById = async (groupId: string): Promise<Interface.IGroupInfo> => {
    return postProcessGroupInfo((await searchGroups({ groupId }))[0] || {});
}

export const getMyGroups = async (): Promise<Interface.IGroupInfo[]> => {
    return (await searchGroups({ myGroupFlag: true })).map(postProcessGroupInfo);
}

export const joinGroup = async (groupId: string) => {
    return await request("/joingroup", { groupId, username: '{{@username}}', }, 'string');
}

export const searchRestaurants = async (params: {name: string, cuisine?: string[]}): Promise<Interface.IRestaurant[]> => {
    return await request("/searchrestaurant", params, 'array');
}

export const getMessages = async (groupId: string, lastMessageId: number = 0): Promise<Interface.IMessage[]> => {
    return await request("/getmessages", {
        groupId,
        lastMessageId,
    }, 'array');
}

export const sendMessage = async (groupId: string, message: string): Promise<Interface.IMessage> => {
    return await request("/sendmessages", {
        groupId,
        message,
    }, 'string');
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
