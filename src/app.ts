import cron from "node-cron";
import neynarClient from "./neynarClient";
import { SIGNER_UUID, NEYNAR_API_KEY, FARCASTER_BOT_MNEMONIC } from "./config";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import { getLatestScores } from "./scores";

const existingScores = new Set();

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
    const scores = await getLatestScores(); // Getting the latest scores.
    const newScores = scores.filter((score) => !existingScores.has(score.id)); // Filtering out the scores that have already been published.

    newScores.forEach((score) => {
        const msg = `FINAL SCORE\n${score.scores[0].name}: ${score.scores[0].score}\n${score.scores[1].name}: ${score.scores[1].score}`;
        publishCast(msg);
        existingScores.add(score.id);
    });
};

/**
 * Function to publish a message (cast) using neynarClient.
 * @param msg - The message to be published.
 */
const publishCast = async (msg: string) => {
    try {
        // Using the neynarClient to publish the cast.
        await neynarClient.publishCast(SIGNER_UUID, msg);
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
