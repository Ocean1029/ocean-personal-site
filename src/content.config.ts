import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shared = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().datetime({ offset: true }),
  tags: z.array(z.string()).default([]),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: shared.extend({
    summary: z.string(),
    role: z.string(),
    year: z.number().int(),
    technologies: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), url: z.string().url().startsWith('https://') })).default([]),
  }),
});

const cocktailImage = z.object({
  src: z.string().regex(/^\/media\/(?!.*\.\.)(?:[\w-]+\/)*[\w-]+\.(?:avif|webp|jpe?g|png)$/i),
  alt: z.string().min(1),
});

const cocktailIngredient = z.object({
  ingredient: z.string().min(1),
  amount: z.string().optional(),
  unit: z.string().optional(),
}).superRefine((ingredient, ctx) => {
  if (Boolean(ingredient.amount) !== Boolean(ingredient.unit)) {
    ctx.addIssue({ code: 'custom', message: 'amount and unit must be provided together' });
  }
});

const cocktailSchema = shared.extend({
  style: z.enum(['classic', 'improvisation']),
  isVariation: z.boolean(),
  baseClassic: z.string().min(1).optional(),
  image: cocktailImage.optional(),
  spirit: z.string(),
  ingredients: z.array(cocktailIngredient).min(1),
  method: z.string(),
  rating: z.number().min(0).max(5),
  tastedOn: z.string().date(),
  notes: z.string(),
}).superRefine((cocktail, ctx) => {
  if (cocktail.isVariation && (cocktail.style !== 'classic' || !cocktail.baseClassic)) {
    ctx.addIssue({ code: 'custom', message: 'classic variations require a base classic' });
  }
  if (!cocktail.isVariation && cocktail.baseClassic) {
    ctx.addIssue({ code: 'custom', message: 'only variations may have a base classic' });
  }
});

const cocktails = defineCollection({
  loader: glob({ base: './src/content/cocktails', pattern: '**/*.md' }),
  schema: cocktailSchema,
});

const shows = defineCollection({
  loader: glob({ base: './src/content/shows', pattern: '**/*.md' }),
  schema: shared.extend({
    year: z.number().int(),
    platform: z.string(),
    genres: z.array(z.string()),
    rating: z.number().min(0).max(5),
    watchStatus: z.enum(['want-to-watch', 'watching', 'watched']),
    review: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: shared.extend({
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects, cocktails, shows, posts };
