import * as React from 'react';

interface IBaseContainer {
    classNames?: string;
    style?: any;
    children: React.ReactElement;
}

export default function BaseContainer({ children, classNames='', style={} }: IBaseContainer) {
    return (<div className={`base-container ${classNames}`} style={style}>{
        children
    }</div>);
}