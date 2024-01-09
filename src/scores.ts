import axios from "axios";
import { GameResult, GameResultSchema } from "./types";

export const getLatestScores = async () => {
    const query = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/scores/?daysFrom=3&apiKey=${process.env.ODDS_API_KEY}`;
    const response = await axios.get(query);

    return response.data
        .map((game: GameResult) => GameResultSchema.safeParse(game))
        .filter((parseResult: { success: boolean }) => parseResult.success)
        .map((parseResult: { data: GameResult }) => parseResult.data);
};
