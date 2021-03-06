import { User, Game } from './client';
import { HandPointResults } from '../modules/mahjong/types/MahjongTypes';

/**
 * Interface for all messages received from WebSocket.
 */
export interface ReceivedJSON {
  action: string;
  payload: unknown;
}

/**
 * Interface for LOGIN_SUCCESS payload received
 */
export interface LoginSuccessJSON {
  success: boolean;
  error?: string;
}

/**
 * Interface for GET_ALL_USERS payload received
 */
export interface UsersJSON {
  users: User[];
}

/**
 * Interface for USER_UPDATE payload received
 */
export interface UpdateUserJSON {
  user: User;
  state: string;
}

/**
 * Interface for GET_ALL_GAMES payload received
 */
export interface GamesJSON {
  games: Game[];
}

/**
 * Interface for GAME_UPDATE payload received
 */
export interface UpdateGameJSON {
  game: Game;
  state: string;
}

/**
 * Interface for SEND_MESSAGE payload received
 */
export interface MessageJSON {
  message: string;
  username: string;
  time: Date;
}

/**
 * Interface for CREATE_GAME payload received
 */
export interface CreateGameJSON {
  success: boolean;
  game: Game;
  error?: string;
}

/**
 * Interface for JOIN_GAME payload received
 */
export interface JoinGameJSON {
  success: boolean;
  game: Game;
  error?: string;
}

/**
 * Interface for LEAVE_GAME payload received
 */
export interface LeaveGameJSON {
  success: boolean;
  game: Game;
  error?: string;
}

/**
 * Interface for IN_GAME_MESSAGE payload received
 */
export interface InGameMessageJSON {
  message: string;
  username: string;
  time: Date;
}

/**
 * Interface for IN_GAME_UPDATE payload received
 */
export interface InGameUpdateJSON {
  users: User[];
}

/**
 * Interface for START_GAME payload received
 */
export interface StartGameJSON {
  success: boolean;
  error?: string;
}

/**
 * Interface for GAME_PAGE_LOAD payload received
 */
export interface GamePageLoadJSON {
  success: boolean;
  error?: string;
}

/**
 * Interface for Self Played Tile
 */
export interface SelfPlayedTile {
  connectionId: string;
  playedTiles: string[];
}

/**
 * Interface for GAME_START payload received
 */
export interface GameStartJSON {
  tiles: string[];
  selfPlayedTiles: SelfPlayedTile[];
  currentIndex: number;
}

/**
 * Interface for DRAW_TILE payload received
 */
export interface DrawTileJSON {
  tile: string;
  currentIndex: number;
}

/**
 * Interface for PLAY_TILE payload received
 */
export interface PlayTileJSON {
  tile: string;
  connectionId: string;
}

/**
 * Interface for INTERACTION_SUCCESS payload received
 */
export interface InteractionSuccessJSON {
  connectionId?: string;
  playedTiles?: string[];
  meldType?: string;
  skipInteraction: boolean;
  success: boolean;
}

/**
 * Interface for PLAYED_TILE_INTERACTION payload received
 */
export interface PlayedTileInteractionJSON {
  playedTiles: string[];
  meldType: string;
  skipInteraction: boolean;
  success: boolean;
  error: string;
  connectionId: string;
}

/**
 * Interface for SELF_PLAY_TILE payload received
 */
export interface SelfPlayTileJSON {
  connectionId: string;
  playedTile: string;
  isQuad: boolean;
  alreadyMeld: boolean;
}

/**
 * Interface for WINNING_TILES payload received
 */
export interface WinningTilesJSON {
  connectionId: string;
  handPointResults: HandPointResults;
}

/**
 * Interface for UPDATE_GAME_STATE payload received
 */
export interface UpdateGameStateJSON {
  dealer: number;
  wind: number;
}

/**
 * Interface for DRAW_ROUND payload received
 */
export interface DrawRoundJSON {
  gameId: string;
  connectionId: string;
}
