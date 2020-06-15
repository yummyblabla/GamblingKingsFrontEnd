/**
 * Extends the Wall.ts class.
 * The HongKong wall has bonus tiles (flowers and seasons)
 */

import Wall from '../wall';
import Tile from '../../Tile/tile';
import BonusTile from '../../Tile/bonusTile';
import MahjongVersion from './versions';

import BonusTileInit from '../init/bonus';

class HongKongWall extends Wall {
  static version: MahjongVersion = MahjongVersion.HongKong;

  /**
   * Public Constructor
   */
  constructor() {
    super();
    this.initalizeWall();
  }

  /**
   * Initializes the tiles in the wall.
   * @param reset Boolean, if true, clears the wall as well
   */
  public initalizeWall(reset = false): void {
    if (reset) {
      super.clear();
    }

    super.initializeSimpleTiles();
    super.initializeHonorTiles();
    this.initializeBonusTiles();
    super.shuffleTiles();
  }

  /**
   * Resets and initialize the wall.
   */
  public reset(): void {
    this.initalizeWall(true);
  }

  /**
   * Initialize all the bonus tiles in the wall using the Bonus Tile Init object
   */
  private initializeBonusTiles(): void {
    Object.values(BonusTileInit).forEach((object) => {
      for (let value = 1; value <= 4; value += 1) {
        const b: BonusTile = new BonusTile(object.type, value);
        this.tiles.push(b);
      }
    });
  }

  /**
   * Generate a hand
   * @returns a tile array
   */
  public generateHand(): Tile[] {
    return super.generateHand();
  }

  /**
   * Draws a tile from the wall
   * @returns a Tile
   */
  public draw(): Tile | null | undefined {
    return super.draw();
  }

  /**
   * @returns the tiles property
   */
  public getTiles(): Tile[] {
    return super.getTiles();
  }
}

export default HongKongWall;
