export type ChatRoom = {
    id?: number,
    name?: string,
    password?: string,
    numPeople?: number,
    public?: boolean;
}

export type ChatMessage = {
    username?: string,
    message?: string,
}

export type User = {
    username?: string,
}