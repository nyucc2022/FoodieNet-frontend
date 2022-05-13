import Amplify, { Auth, API } from 'aws-amplify';
import { assign } from './utils';
Amplify.configure({
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_mTFY5PaNg',
        userPoolWebClientId: '1naa0iopcjui825555sqj24vvl',
        mandatorySignIn: true,
        authenticationFlowType: 'USER_PASSWORD_AUTH',

    },
    API: {
        endpoints: [{
            name: "default",
            endpoint: "https://2da2d0z753.execute-api.us-east-1.amazonaws.com/dev",
            custom_header: async () => ({
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            }),
        }],
    }
});

assign('auth', Auth);

export const pool = {
    user: null as any,
};

export const currentUser = () => pool.user;

export const post = async (path: string, body: any) => {
    Object.keys(body).forEach(key => {
        if (body[key] === '{{@username}}') {
            body[key] = pool.user?.getUsername?.()?.toLocaleLowerCase?.() || '';
        } 
    });
    return API.post("default", path, {
        body,
    })
}

export const getUserInfo = async () => {
    return await Auth.currentUserInfo();
}

export const getUser = async () => {
    try {
        return pool.user = await Auth.currentAuthenticatedUser();
    } catch(err) {
        pool.user = null;
        return null;
    }
}

export const signOut = async () => {
    pool.user = null;
    await Auth.signOut();
}

export const signIn = async (username: string, password: string) => {
    return pool.user = await Auth.signIn(username, password);
}

export const signUp = async (username: string, password: string, attributes: {[key: string]: any}) => {
    return await Auth.signUp({
        username,
        password,
        attributes,
    });
}