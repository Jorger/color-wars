import { PlayerId } from "rune-sdk";
import type { Player, PlayerScore } from "../../../../interfaces";

interface GetPlayersScore {
  players: Player[];
  yourPlayerId: PlayerId;
}

/**
 * Sets the position of the players in the score...
 * @param param0
 */
export const getPlayersScore = ({
  players = [],
  yourPlayerId,
}: GetPlayersScore) => {
  /**
   * Extracts player information containing name and avatar
   */
  const playersScore: PlayerScore[] = players.map(
    ({ playerID, color, score }) => {
      const playerInfo = Rune.getPlayerInfo(playerID);

      return {
        ...playerInfo,
        displayName: playerID === yourPlayerId ? "You" : playerInfo.displayName,
        score,
        color,
      };
    }
  );

  /**
   * Sets the order in which rendering will take place
   */
  const order = playersScore[0].playerId === yourPlayerId ? [0, 1] : [1, 0];

  /**
   * Returns the information to be rendered
   */
  return order.map((index) => playersScore[index]);
};
