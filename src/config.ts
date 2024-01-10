import dotenv from "dotenv";
dotenv.config();

export const FARCASTER_BOT_MNEMONIC = process.env.FARCASTER_BOT_MNEMONIC!;
export const SIGNER_UUID = process.env.SIGNER_UUID!;
export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
export const SPORTS = [
    {
        sportId: "icehockey_nhl",
        channelUrl: "https://warpcast.com/~/channel/hockey",
    },
    {
        sportId: "basketball_nba",
        channelUrl: "https://www.nba.com",
    },
];
