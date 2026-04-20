import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

const ConfigSchema = z.object({
  figmaToken: z.string().min(1, 'Figma API token is required'),
  fileKey: z.string().min(1, 'Figma file key is required'),
  output: z.object({
    dir: z.string().default('./tokens'),
    formats: z.array(z.enum(['css', 'json'])).default(['css', 'json']),
  }).default({}),
  prefix: z.string().default('--token'),
});

export async function loadConfig(configPath) {
inkdrop');

  try {
    const result = configPath
      ? await explorer.load(configPath)
      : await explorer.search();

    if (!result || result.isEmpty) {
      throw new Error(
        'No configuration found. Create an inkdrop.config.js or add an "inkdrop" key to package.json.'
      );
    }

    const parsed = ConfigSchema.safeParse(result.config);

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n');
      throw new Error(`Invalid configuration:\n${issues}`);
    }

    return parsed.data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Config file not found: ${configPath}`);
    }
    throw err;
  }
}

export { ConfigSchema };
