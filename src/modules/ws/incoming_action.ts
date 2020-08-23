enum IncomingAction {
  /**
   * Main
   */
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  /**
   * Lobby
   */
  GET_ALL_GAMES = 'GET_ALL_GAMES',
  GET_ALL_USERS = 'GET_ALL_USERS',
  CREATE_GAME = 'CREATE_GAME',
  SEND_MESSAGE = 'SEND_MESSAGE',
  GAME_UPDATE = 'GAME_UPDATE',
  USER_UPDATE = 'USER_UPDATE',
  LEAVE_GAME = 'LEAVE_GAME',
  JOIN_GAME = 'JOIN_GAME',

  /**
   * Game Lobby
   */
  IN_GAME_UPDATE = 'IN_GAME_UPDATE',
  IN_GAME_MESSAGE = 'IN_GAME_MESSAGE',
  START_GAME = 'START_GAME',

  /**
   * Game
   */
  GAME_PAGE_LOAD = 'GAME_PAGE_LOAD',
  GAME_START = 'GAME_START',
  DRAW_TILE = 'DRAW_TILE',
  PLAY_TILE = 'PLAY_TILE',
  INTERACTION_SUCCESS = 'INTERACTION_SUCCESS',
  PLAYED_TILE_INTERACTION = 'PLAYED_TILE_INTERACTION',
  SELF_PLAY_TILE = 'SELF_PLAY_TILE',
  WINNING_TILES = 'WINNING_TILES',
  UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
  DRAW_ROUND = 'DRAW_ROUND',
}

export default IncomingAction;
