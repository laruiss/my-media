import { z } from 'zod'

const omdbSearchMediaSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.enum(['movie', 'series']),
  Poster: z.string(),
})

export const omdbSearchResponseSchema = z.object({
  Search: z.array(omdbSearchMediaSchema),
  totalResults: z.string(),
  Response: z.enum(['True', 'False']),
})

export type OmdbSearchResponse = z.infer<typeof omdbSearchResponseSchema>

export const omdbMediaSchema = z.object({
  Language: z.string(),
  Country: z.string(),
  Awards: z.string(),
  Poster: z.string(),
  Ratings: z.array(
    z.object({
      Source: z.string(),
      Value: z.string(),
    }),
  ),
  Metascore: z.string(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  DVD: z.string(),
  BoxOffice: z.string(),
  Production: z.string(),
  Website: z.string(),
  Response: z.string(),
})

export type Media = z.infer<typeof omdbMediaSchema>
