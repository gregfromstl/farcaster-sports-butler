import { z } from "zod";

export const GameResultSchema = z.object({
    id: z.string(),
    completed: z.literal(true),
    scores: z
        .array(
            z.object({
                name: z.string(),
                score: z
                    .string()
                    .transform((x) => parseInt(x))
                    .refine((x) => !isNaN(x) && x >= 0),
            })
        )
        .length(2),
});

export type GameResult = z.infer<typeof GameResultSchema>;
