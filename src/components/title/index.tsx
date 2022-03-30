import * as React from 'react';

interface ITitle {
    classNames?: string;
    style?: any;
    children: JSX.Element | JSX.Element[] | string;
}

export default function Title({ children, classNames='', style={} }: ITitle) {
    return (<h1 className={`base-h1 ${classNames}`} style={style}>{
        children
    }</h1>);
}