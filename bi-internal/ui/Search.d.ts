import React from 'react';

interface ISearch extends React.InputHTMLAttributes<HTMLInputElement> {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export declare const Search: React.FC<ISearch>
export default Search;

