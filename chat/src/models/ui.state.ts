// Used in the mobile home screen for switching pages
export enum PageState {
  ROOMS,
  CHAT,
  USERS,
}

// Used to store if the user is talking in a room or sending a private message
export enum ChatState {
  ROOM,
  PRIVATE,
  NONE,
}

export enum RoomCreationState {
  PUBLIC,
  PRIVATE,
}
