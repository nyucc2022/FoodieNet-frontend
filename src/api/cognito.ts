import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { assign, waitUntil, EventCounter } from './utils';

let activeProcess = EventCounter();
const poolData = {
	UserPoolId: 'us-east-1_mTFY5PaNg',
	ClientId: '1naa0iopcjui825555sqj24vvl',
};

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const currentUser = () => pool.user;
export const currentSession = () => pool.session;

const pool = {
    user: null as AmazonCognitoIdentity.CognitoUser | null,
    session: null as AmazonCognitoIdentity.CognitoUserSession | null,
    clear: function () {
        this.user?.signOut();
        this.user = null;
        this.session = null;
    }
};
assign("pool", pool);

export const activateUser = (): Promise<AmazonCognitoIdentity.CognitoUser | null> => {
    return new Promise((resolve) => {
        const user = userPool.getCurrentUser();
        if (user) {
            user.getSession((_: any, session: AmazonCognitoIdentity.CognitoUserSession) => {
                if (!(session && session.isValid())) {
                    pool.clear();
                    resolve(null);
                } else {
                    pool.user = user;
                    pool.session = session;
                    resolve(user);
                }
            })
        } else {
            pool.clear();
            resolve(null);
        }
    }).then((v: any) => {
        return v;
    });
}

export const getUser = async (waits = false) => {
    const returns = () => ({
        user: pool.user,
        session: pool.session,
    });
    const shouldWait = waits && !pool.user;
    if (pool.user) {
        console.log(">> getUser Cached");
        activeProcess.dec();
        return returns();
    } else if (activeProcess.add(shouldWait ? 0.01 : 1) > 1.99) {
        console.log(">> getUser Await");
        await waitUntil(() => pool.user);
        activeProcess.dec();
        return returns();
    }
    
    console.log(">> getUser Fetch");
    await activateUser();
    activeProcess.reset();
    console.log("<< getUser");
    return returns();
}

export const signOut = () => {
    pool.clear();
}

export const currentUsername = () => currentUser()?.getUsername() || '';

export const getUserAttributes = async (): Promise<any> => {
    const result = {} as {[key: string]: string};
    return new Promise(async (resolve, reject) => {
        const { user } = await getUser(true);
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
    console.log(">> Call Sign in")
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
                    onFailure(new Error("Auth Error: cannot fetch user info."))
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