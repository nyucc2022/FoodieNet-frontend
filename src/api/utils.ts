
export const choose = <T>(list: T[] | string) => {
    return list[Math.floor(Math.random() * list.length)];
}

export const sleep = (timeout: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export const waitUntil = async (cond: Function, interval = 10) => {
    if (!cond || typeof cond !== "function" || interval < 10) return;
    while (!cond()) {
        await sleep(interval);
    }
}

export const call = (fn: string, ...args: any[]) => {
    // @ts-ignore
    return window.helpers?.[fn]?.(...args);
}

export const assign = (key: string, val: any) => {
    // @ts-ignore
    return window[key] = val;
}

export const EventCounter = () => {
    let counter = 0;
    return {
        reset: () => counter = 0,
        add: (num = 1) => counter += num,
        dec: (num = 1) => { counter -= num; if (counter < 0) counter = 0; return counter; },
    }
}