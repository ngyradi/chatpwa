export type ChatRoom = {
    id?: number,
    name?: string,
    password?: string,
    numPeople: number,
    hasPassword?: boolean,
    public?: boolean,
    joinCode?: string,
}


export type ChatMessage = {
    username?: string,
    message?: string,
}

export type PrivateMessage = {
    socketId?: string,
    message?: string,
    username?: string,
}

export type User = {
    username?: string,
    socketId?: string,
}