import cron from "node-cron";
import neynarClient from "./neynarClient";
import {
    SIGNER_UUID,
    NEYNAR_API_KEY,
    FARCASTER_BOT_MNEMONIC,
    SPORTS,
} from "./config";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import { getLatestScores } from "./scores";
import fs from "fs";

// Validating necessary environment variables or configurations.
if (!FARCASTER_BOT_MNEMONIC) {
    throw new Error("FARCASTER_BOT_MNEMONIC is not defined");
}
if (!SIGNER_UUID) {
    throw new Error("SIGNER_UUID is not defined");
}

if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY is not defined");
}

/**
 * Function to publish all new finalized scores.
 */
const publishScores = async () => {
    // Check if games.txt exists, if not, create it
    if (!fs.existsSync("games.txt")) {
        fs.writeFileSync("games.txt", "");
    }

    SPORTS.forEach(async (sport) => {
        const scores = await getLatestScores(sport.sportId); // Getting the latest scores.
        const existingScores = new Set(
            fs.readFileSync("games.txt", "utf-8").split("\n")
        );
        const newScores = scores.filter(
            (score) => !existingScores.has(score.id)
        ); // Filtering out the scores that have already been published.

        newScores.forEach((score) => {
            const msg = `FINAL SCORE\n${score.scores[0].name}: ${score.scores[0].score}\n${score.scores[1].name}: ${score.scores[1].score}`;
            publishCast(msg);
            fs.appendFileSync("games.txt", `${score.id}\n`);
        });
    });
};

/**
 * Function to publish a message (cast) using neynarClient.
 * @param msg - The message to be published.
 */
const publishCast = async (msg: string, channelUrl?: string) => {
    try {
        // Using the neynarClient to publish the cast.
        await neynarClient.publishCast(SIGNER_UUID, msg, {
            replyTo: channelUrl,
        });
        console.log("Cast published successfully");
    } catch (err: any) {
        // Error handling, checking if it's an API response error.
        if (isApiErrorResponse(err)) {
            console.log(err.response.data);
        } else console.log(err);
    }
};

// Scheduling a cron job to report scores at the top of every hour
cron.schedule(
    `0 * * * *`, // Cron time format
    function () {
        publishScores(); // Function to execute at the scheduled time.
    },
    {
        scheduled: true, // Ensure the job is scheduled.
    }
);

// Logging to inform that the cron job is scheduled.
console.log(
    `Cron scheduled to report new scores every hour, please don't restart your system before the scheduled time.`
);
