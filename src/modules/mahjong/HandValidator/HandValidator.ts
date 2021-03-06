/**
 * Class to store logic related to validating a Mahjong Hand
 */
import Tile from '../Tile/Tile';
// eslint-disable-next-line
import { ValidPair, Meld, HandStructureResults, CreateMeldResults } from '../types/MahjongTypes';
import TileMapper from '../Tile/map/TileMapper';
import MeldTypes from '../enums/MeldEnums';
import sortHandUtils from '../utils/functions/sortHand';
import Hand from '../Hand/Hand';
import {
  isSimpleTile as isSimpleTileUtils,
  isBonusTile as isBonusTileUtils,
  isBonusTile,
} from '../utils/functions/checkTypes';
import WindEnums from '../enums/WindEnums';

class HandValidator {
  public static TRIPLET_SIZE = 3;

  public static KAN_SIZE = 4;

  public static MIN_HAND_SIZE = 14;

  public static DEFAULT_MELD_SIZE = 3;

  public static REQUIRED_NUM_OF_MELDS = 4;

  /**
   * Validates the Length of the hand must be 14
   * @param tiles An array of tile objects
   * @returns boolean, true if hand length is 14, otherwise false
   */
  public static validateHandLength(tiles: Tile[]): boolean {
    if (tiles.length !== 14) return false;
    return true;
  }

  /**
   * Validates if the hand is a valid thirteen orphans hand
   * @param tiles An array of tile objects
   * @returns true if the hand is valid, otherwise false
   */
  public static validateThirteenOrphans(tiles: Tile[]): boolean {
    if (!this.validateHandLength(tiles)) {
      return false;
    }

    const thirteenOrphansTileRequirement: { [index: string]: number } = {
      '1_DOT': 0,
      '9_DOT': 0,
      '1_BAMBOO': 0,
      '9_BAMBOO': 0,
      '1_CHARACTER': 0,
      '9_CHARACTER': 0,
      EAST: 0,
      SOUTH: 0,
      WEST: 0,
      NORTH: 0,
      REDDRAGON: 0,
      GREENDRAGON: 0,
      WHITEDRAGON: 0,
    };

    let failed = false;

    tiles.forEach((t) => {
      if (Object.prototype.hasOwnProperty.call(thirteenOrphansTileRequirement, t.toString())) {
        thirteenOrphansTileRequirement[t.toString()] += 1;
      } else {
        failed = true;
      }
    });

    if (failed) {
      return false;
    }

    if (Object.values(thirteenOrphansTileRequirement).every((el) => el >= 1)) return true;

    return false;
  }

  /**
   * Creates an object mapping of the tiles to determine the number of each tile in the hand
   * @param tiles An array of tile objects
   * @returns object containing the number of each tile in the hand
   */
  public static createTileMapping(tiles: Tile[]): { [index: string]: number } {
    const mapping: { [index: string]: number } = {};
    const sortedTiles = sortHandUtils(tiles, Hand.generateHandWeights());
    sortedTiles.forEach((t) => {
      const tileStr = t.toString();
      if (!isBonusTileUtils(tileStr)) {
        if (Object.prototype.hasOwnProperty.call(mapping, tileStr)) mapping[tileStr] += 1;
        else mapping[tileStr] = 1;
      }
    });

    return mapping;
  }

  public static determineAllPossiblePairs(
    tiles: Tile[],
    wind: WindEnums = WindEnums.EAST,
    flower = 1,
    roundWind = WindEnums.EAST,
    concealed = false,
  ): ValidPair[] {
    const tileMapping = this.createTileMapping(tiles);
    const filteredTiles = tiles.filter((t) => !isBonusTile(t.toString()));
    const bonusTiles = tiles.filter((t) => isBonusTile(t.toString()));

    /**
     * Valid Pair Schema:
     * {
     *  pair: '1_CHARACTER',
     *  remainingTiles: {},
     *  numTiles: number
     * }
     */
    const validPairs: ValidPair[] = [];
    const mappingKeys = Object.keys(tileMapping);
    const numTiles = Object.values(tileMapping).reduce((pv, cv) => pv + cv);

    mappingKeys.forEach((key) => {
      if (tileMapping[key] >= 2) {
        const mappingCopy = { ...tileMapping };

        mappingCopy[key] -= 2;

        validPairs.push({
          pair: key,
          remainingTiles: mappingCopy,
          numTiles,
          filteredTiles,
          bonusTiles,
          wind,
          flower,
          roundWind,
          concealed,
        });
      }
    });

    return validPairs;
  }

  /**
   * Determines all possible valid hands and invalid hands
   * @param validPairs an array of ValidPairs
   */
  public static validiateValidHandStructure(validPairs: ValidPair[]): HandStructureResults {
    const results: HandStructureResults = {
      valid: [],
      invalid: [],
      isThirteenTerminals: false,
    };

    validPairs.forEach((vp) => {
      results.isThirteenTerminals = HandValidator.validateThirteenOrphans(vp.filteredTiles);
      if (results.isThirteenTerminals) {
        results.valid.push({
          ...vp,
          melds: [],
        });
      } else {
        const { remainingTiles, numTiles } = vp;
        const copyRemainingTiles = { ...remainingTiles }; // modify copy to preserve original object
        const melds: Meld[] = [];
        let passed = true;

        if (numTiles > this.MIN_HAND_SIZE) {
          // There is a 4 of a kind somewhere in the hand and has to be used as a four of a kind
          Object.keys(copyRemainingTiles).forEach((key) => {
            if (copyRemainingTiles[key] === this.KAN_SIZE) {
              const meld: Meld = {
                tiles: [key, key, key, key],
                type: MeldTypes.QUAD,
              };
              copyRemainingTiles[key] -= this.KAN_SIZE;
              melds.push(meld);
            }
          });
        }

        // Start trying to create all consecutive melds
        // Cannot start with triplets as there is a chance we use the triplet for a consecutive
        Object.keys(copyRemainingTiles).forEach((key) => {
          const isSimpleTile: boolean = isSimpleTileUtils(key);

          // n = number that can be used to create a consecutive
          let n = copyRemainingTiles[key] < this.TRIPLET_SIZE || copyRemainingTiles[key] === this.KAN_SIZE;
          n = copyRemainingTiles[key] > 0 && n;

          if (isSimpleTile && n) {
            while (passed && copyRemainingTiles[key] !== 0 && copyRemainingTiles[key] !== this.TRIPLET_SIZE) {
              const meldTiles = [key];
              copyRemainingTiles[key] -= 1;

              let currentConsecutive = key;
              let nextConsecutive = TileMapper[key].next;

              while (meldTiles.length < 3 && nextConsecutive && passed) {
                if (copyRemainingTiles[nextConsecutive] >= 1) {
                  meldTiles.push(nextConsecutive);
                  copyRemainingTiles[nextConsecutive] -= 1;
                  currentConsecutive = nextConsecutive;
                  nextConsecutive = TileMapper[currentConsecutive].next;
                } else passed = false;
              }

              if (meldTiles.length === this.DEFAULT_MELD_SIZE) {
                melds.push({
                  tiles: meldTiles,
                  type: MeldTypes.CONSECUTIVE,
                });
              }
            }
          }
        });

        // Start trying to create all triplet melds
        if (passed) {
          Object.keys(copyRemainingTiles).forEach((key) => {
            if (copyRemainingTiles[key] === this.TRIPLET_SIZE) {
              const meld = {
                tiles: [key, key, key],
                type: MeldTypes.TRIPLET,
              };
              copyRemainingTiles[key] -= this.TRIPLET_SIZE;
              melds.push(meld);
            }
          });

          if (melds.length === this.REQUIRED_NUM_OF_MELDS) {
            results.valid.push({
              ...vp,
              melds,
            });
          }
        } else {
          results.invalid.push(vp);
        }
      }
    });

    return results;
  }

  /**
   * Determines if a hand can create a meld given a thrown tile
   * @param tiles the tiles in the hand
   * @param tileToTake the tile that is thrown
   * @param positioning whether the hand is positioned correctly to take a consecutive
   */
  public static canCreateMeld = (tiles: Tile[], tileToTake: Tile, positioning = true): CreateMeldResults => {
    const results: CreateMeldResults = {
      tileToTake,
      quad: {
        canCreate: false,
        melds: [],
      },
      triplet: {
        canCreate: false,
        melds: [],
      },
      consecutive: {
        canCreate: false,
        melds: [], // Can create different types of consecutives
      },
    };

    const tileToTakeStrDef = tileToTake.toString();
    const tilesStrDef = tiles.map((t) => t.toString());

    // Try to create a triplet first
    let numberOfTheSameTileInHand = 0;

    tilesStrDef.forEach((t) => {
      if (t === tileToTakeStrDef) numberOfTheSameTileInHand += 1;
    });

    if (numberOfTheSameTileInHand === 2) {
      results.triplet.canCreate = true;
      results.triplet.melds.push({ type: MeldTypes.TRIPLET, tiles: Array(3).fill(tileToTakeStrDef) });
    } else if (numberOfTheSameTileInHand === 3) {
      results.quad.canCreate = true;
      results.quad.melds.push({ type: MeldTypes.QUAD, tiles: Array(4).fill(tileToTakeStrDef) });
    }

    // Try to create a consecutive
    if (positioning) {
      if (isSimpleTileUtils(tileToTakeStrDef)) {
        let { prev, next } = TileMapper[tileToTakeStrDef];

        const lowerBoundTiles: string[] = [];
        const upperboundTiles: string[] = [];
        const bothBoundTiles: string[] = [];

        let ableToCreateLowerBound = true;
        let ableToCreateUpperBound = true;
        let ableToCreateBothBound = true;

        if (prev) bothBoundTiles.push(prev);
        if (next) bothBoundTiles.push(next);

        if (bothBoundTiles.length === 2) {
          bothBoundTiles.forEach((str) => {
            if (str && !tilesStrDef.includes(str)) ableToCreateBothBound = false;
          });

          if (ableToCreateBothBound) {
            results.consecutive.canCreate = true;
            results.consecutive.melds.push({
              type: MeldTypes.CONSECUTIVE,
              tiles: [tileToTakeStrDef, ...bothBoundTiles],
            });
          }
        }

        while (prev && lowerBoundTiles.length !== 2) {
          if (prev) {
            lowerBoundTiles.push(prev);
            prev = TileMapper[prev].prev;
          }
        }

        if (lowerBoundTiles.length === 2) {
          lowerBoundTiles.forEach((str) => {
            if (str && !tilesStrDef.includes(str)) ableToCreateLowerBound = false;
          });

          if (ableToCreateLowerBound) {
            results.consecutive.canCreate = true;
            results.consecutive.melds.push({
              type: MeldTypes.CONSECUTIVE,
              tiles: [tileToTakeStrDef, ...lowerBoundTiles],
            });
          }
        }

        while (next != null && upperboundTiles.length !== 2) {
          if (next) {
            upperboundTiles.push(next);
            next = TileMapper[next].next;
          }
        }

        if (upperboundTiles.length === 2) {
          upperboundTiles.forEach((str) => {
            if (str && !tilesStrDef.includes(str)) ableToCreateUpperBound = false;
          });

          if (ableToCreateUpperBound) {
            results.consecutive.canCreate = true;
            results.consecutive.melds.push({
              type: MeldTypes.CONSECUTIVE,
              tiles: [tileToTakeStrDef, ...upperboundTiles],
            });
          }
        }
      }
    }

    return results;
  };
}

export default HandValidator;
