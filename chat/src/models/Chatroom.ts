export interface ChatRoom {
  id?: number
  name?: string
  password?: string
  numPeople?: number
  hasPassword?: boolean
  public?: boolean
}

export interface ChatMessage {
  username?: string
  message?: string
  info?: boolean
}

export interface PrivateMessage {
  socketId?: string
  message?: string
  username?: string
}

export interface User {
  username?: string
  socketId?: string
}
