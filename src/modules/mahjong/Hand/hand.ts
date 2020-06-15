/**
 * The Hand class represents a player's hand in Mahjong. It consists of
 * a 13 tile hand that contains various different tiles. The player
 * continuously draws and throws tile from the hand until a winning hand
 * is reached.
 */

import Tile from '../Tile/tile';
import Wall from '../Wall/wall';
import DeadPile from '../DeadPile/deadPile';
import SimpleTileTypes from '../Tile/types/simpleTileTypes';
import HonorTileTypes from '../Tile/types/honorTileTypes';
import BonusTileTypes from '../Tile/types/bonusTileTypes';

interface SortHandWeights {
  [SimpleTileTypes.DOT]: number;
  [SimpleTileTypes.BAMBOO]: number;
  [SimpleTileTypes.CHARACTER]: number;
  [HonorTileTypes.EAST]: number;
  [HonorTileTypes.SOUTH]: number;
  [HonorTileTypes.WEST]: number;
  [HonorTileTypes.NORTH]: number;
  [HonorTileTypes.GREEN_DRAGON]: number;
  [HonorTileTypes.RED_DRAGON]: number;
  [HonorTileTypes.WHITE_DRAGON]: number;
  [BonusTileTypes.FLOWER]: number;
  [BonusTileTypes.SEASON]: number;
}

class Hand {
  private hand: Tile[];

  /**
   * Public constructor. Generates a hand from a wall and sorts to the hand
   * @param wall A child of the Wall class
   * @param weights SortHandWeights object that is used to sort the hand
   */
  constructor(wall: Wall, weights: SortHandWeights) {
    this.hand = wall.generateHand();
    this.sort_hand(weights);
  }

  /**
   * Static method to generate an object used to sort the hands
   * @param dot number
   * @param bamboo number
   * @param character number
   * @param east number
   * @param south number
   * @param west number
   * @param north number
   * @param green number
   * @param red number
   * @param white number
   * @param flower number
   * @param season number
   * @returns SortHandWeights, the object with tile weights
   */
  static generateHandWeights(
    dot = 1,
    bamboo = 2,
    character = 3,
    east = 4,
    south = 5,
    west = 6,
    north = 7,
    green = 8,
    red = 9,
    white = 10,
    flower = 11,
    season = 12,
  ): SortHandWeights {
    return {
      [SimpleTileTypes.DOT]: dot,
      [SimpleTileTypes.BAMBOO]: bamboo,
      [SimpleTileTypes.CHARACTER]: character,
      [HonorTileTypes.EAST]: east,
      [HonorTileTypes.SOUTH]: south,
      [HonorTileTypes.WEST]: west,
      [HonorTileTypes.NORTH]: north,
      [HonorTileTypes.GREEN_DRAGON]: green,
      [HonorTileTypes.RED_DRAGON]: red,
      [HonorTileTypes.WHITE_DRAGON]: white,
      [BonusTileTypes.FLOWER]: flower,
      [BonusTileTypes.SEASON]: season,
    };
  }

  /**
   * @returns the hand property
   */
  public getHand(): Tile[] {
    return this.hand;
  }

  /**
   * Throws a tile at a given index into the deadpile
   * @param index number
   * @param deadPile DeadPile object
   */
  public throw(index: number, deadPile: DeadPile): boolean {
    if (this.hand.length > index) {
      deadPile.lastThrown(this.hand.splice(index, 1)[0]);
      return true;
    }

    return false;
  }

  /**
   * Draws a tile from a wall
   * @param wall a child of the Wall class
   */
  public draw(wall: Wall): Tile | null {
    const t: Tile | undefined | null = wall.draw();
    if (t) {
      this.hand.push(t);
      return t;
    }

    return null;
  }

  /**
   * Sorts the hand based on given weights
   * @param weights SortHandWeights, an object that stores tile weights
   */
  public sort_hand(weights: SortHandWeights): void {
    this.hand.sort((t1, t2) => {
      const t1Type = t1.getType();
      const t2Type = t2.getType();

      if (t1Type === t2Type && t1Type in SimpleTileTypes) {
        const v1 = t1.getValue();
        const v2 = t2.getValue();

        return v1 - v2;
      }

      return weights[t1Type] - weights[t2Type];
    });
  }
}

export default Hand;
