import * as React from 'react';

interface IBaseContainer {
    classNames?: string;
    style?: any;
    children: JSX.Element | JSX.Element[];
}

export default function BaseContainer({ children, classNames='', style={} }: IBaseContainer) {
    return (<div className={`base-container ${classNames}`} style={style}>{
        children
    }</div>);
}