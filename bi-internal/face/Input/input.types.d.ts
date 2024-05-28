import React from 'react';

export interface IInput extends React.FC<React.InputHTMLAttributes<HTMLInputElement>> {
    Label: React.FC<IInputLabel>;
}
export interface IInputLabel extends React.LabelHTMLAttributes<HTMLElement> {
    readonly children?: any;
}
