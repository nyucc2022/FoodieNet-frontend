import * as React from 'react';

interface ITitle {
    classNames?: string;
    style?: any;
    innerRef?: React.Ref<HTMLDivElement>,
    children: JSX.Element | JSX.Element[] | string;
}

export default function Title({ children, innerRef, classNames='', ...props }: ITitle) {
    return (<h1 ref={innerRef} className={`base-h1 ${classNames}`} {...props}>{
        children
    }</h1>);
}