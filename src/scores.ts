import axios from "axios";
import { GameResult, GameResultSchema } from "./types";

/**
 * Retrieves all final NHL scores from the past 24 hours.
 */
export const getLatestScores = async (): Promise<GameResult[]> => {
    const query = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/scores/?daysFrom=1&apiKey=${process.env.ODDS_API_KEY}`;
    const response = await axios.get(query);

    return response.data
        .map((game: GameResult) => GameResultSchema.safeParse(game))
        .filter((parseResult: { success: boolean }) => parseResult.success)
        .map((parseResult: { data: GameResult }) => parseResult.data);
};
