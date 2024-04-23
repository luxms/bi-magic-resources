import React from 'react';
import {repo} from '../core';



export class User {
    public id: number;
    public title: string;
    public raw: repo.adm.IRawUser;
    public constructor(raw: repo.adm.IRawUser);
}

export interface IDlgShareWithUserProps {
    onClosePress: () => void;
    share: (user: User) => Promise<any>;
    title: string;
    noUsersError: string;
    users: User[];
    selectedUsers?: User[];
    loading: boolean;
    error: string;
}

/**
 *   DlgShareWithUser component
 *   Shows dialog with users, allow search, select users
 *    displays error, loading
 *
 */
export class DlgShareWithUser extends React.Component<IDlgShareWithUserProps> {
    public constructor(props: IDlgShareWithUserProps)
}
