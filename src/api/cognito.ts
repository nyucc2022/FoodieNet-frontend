import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { reject } from 'lodash';

const poolData = {
	UserPoolId: 'us-east-1_mTFY5PaNg',
	ClientId: '1naa0iopcjui825555sqj24vvl',
};

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const currentUser = () => poll.user;

const poll = {
    user: <AmazonCognitoIdentity.CognitoUser | null>null,
};

export const activateUser = (): Promise<AmazonCognitoIdentity.CognitoUser | null> => {
    return new Promise((resolve) => {
        const user = userPool.getCurrentUser();
        if (user) {
            user.getSession((_: any, session: AmazonCognitoIdentity.CognitoUserSession) => {
                if (!(session && session.isValid())) {
                    user.signOut();
                    poll.user = null;
                    resolve(null);
                } else {
                    poll.user = user;
                    // @ts-ignore
                    window['session'] = session;
                    resolve(user);
                }
            })
        }
        poll.user = null;
        resolve(null);
    });
}

export const getUser = async () => {
    if (poll.user) {
        return poll.user;
    }

    return await activateUser();
}

export const currentUsername = () => currentUser()?.getUsername() || '';

export const getUserAttributes = async (): Promise<any> => {
    const result = {} as {[key: string]: string};
    return new Promise(async (resolve, reject) => {
        const user = await getUser();
        if (!user) {
            reject(new Error('Error: Cannot get logined user'));
            return;
        }
        
        result.username = user.getUsername();
        user.getUserAttributes((err, attrs) =>  {
            if (!attrs) {
                reject(err);
                return;
            }
            
            for (let attr of attrs) {
                result[attr.Name] = attr.Value;
            }
            resolve(result);
        });
    })
    
}

export const withUser = (Username: string) => new AmazonCognitoIdentity.CognitoUser({
    Username,
    Pool: userPool,
});

export const withAttrs = (obj: {[key: string]: any}) => {
    return Object.keys(obj).map(key => new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: key,
        Value: obj[key],
    }));
};

export const signIn = async (username: string, password: string): Promise<AmazonCognitoIdentity.CognitoUser> => {
    return new Promise((resolve, onFailure) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });
        withUser(username).authenticateUser(authenticationDetails, {
            onSuccess: async result => {
                const user = userPool.getCurrentUser();
                await activateUser();
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error("Auth Error: cannot fetch user info."))
                }
            },
            onFailure,
        })
    });
}

export const signUp = async (username: string, password: string, obj: {[key: string]: any}): Promise<AmazonCognitoIdentity.ISignUpResult> => {
    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, withAttrs(obj), [], function(err, result) {
            if (!result) {
                reject(err);
            }
            resolve(result!);
        });
    })
}