import dotenv from 'dotenv';
import { z } from 'zod';
import { Logger } from './logger.js';

dotenv.config();

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN es requerido'),
	DISCORD_APP_ID: z.string().min(1, 'DISCORD_APP_ID es requerido'),
	DISCORD_GUILD_ID: z.string().min(1, 'DISCORD_GUILD_ID es requerido'),
	DEBUG: z.string().transform((val) => {
		const lower = val.toLowerCase();
		return lower === 'true' || lower === '1';
	}),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerido'),
	NODE_ENV: z.enum(['development', 'production', 'test'], {
		errorMap: () => ({ message: "NODE_ENV debe ser 'development', 'production' o 'test'" }),
	}),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	try {
		return envSchema.parse(process.env);
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.error('Error de validación en variables de entorno:');

			for (const issue of err.issues) {
				console.error(`- ${issue.path.join('.')}: ${issue.message}`);
			}
		} else {
			Logger.error('Error inesperado al validar variables de entorno:', err);
		}

		process.exit(1);
	}
}

export const env = validateEnv();
