const BASE_URL = 'https://apis.ccbp.in';

export interface Movie {
  id: string;
  title: string;
  posterPath: string;
  backdropPath: string;
  overview?: string;
  releaseDate?: string;
  runtime?: number;
  adult?: boolean;
  budget?: string;
  voteAverage?: number;
  voteCount?: number;
  genres?: { id: number; name: string }[];
  spokenLanguages?: { id: string; englishName: string }[];
  similarMovies?: Movie[];
}

interface ApiMovie {
  id: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview?: string;
  release_date?: string;
  runtime?: number;
  adult?: boolean;
  budget?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
  spoken_languages?: { id: string; english_name: string }[];
  similar_movies?: ApiMovie[];
}

const transformMovie = (movie: ApiMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  overview: movie.overview,
  releaseDate: movie.release_date,
  runtime: movie.runtime,
  adult: movie.adult,
  budget: movie.budget,
  voteAverage: movie.vote_average,
  voteCount: movie.vote_count,
  genres: movie.genres,
  spokenLanguages: movie.spoken_languages?.map((lang) => ({
    id: lang.id,
    englishName: lang.english_name,
  })),
  // Recursively transforms similar movies if they exist in the API response
  similarMovies: movie.similar_movies?.map(transformMovie),
});

/**
 * AUTHENTICATION
 */
export const login = async (username: string, password: string): Promise<{ jwt_token: string }> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_msg || 'Login failed');
  }
  return response.json();
};

/**
 * MOVIE FETCHING
 */
const getAuthHeaders = (jwtToken: string) => ({
  Authorization: `Bearer ${jwtToken}`,
});

export const fetchTrendingMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies-app/trending-movies`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to fetch trending movies');
  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchOriginalMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies-app/originals`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to fetch original movies');
  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchPopularMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies-app/popular-movies`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to fetch popular movies');
  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchTopRatedMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies-app/top-rated-movies`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to fetch top rated movies');
  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchMovieDetails = async (jwtToken: string, movieId: string): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movies-app/movies/${movieId}`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to fetch movie details');
  const data = await response.json();
  // Fixed: movie_details already includes similar_movies; transformMovie handles the nesting.
  return transformMovie(data.movie_details);
};

export const searchMovies = async (jwtToken: string, query: string): Promise<Movie[]> => {
  // Path corrected to /movies-app/movies-search based on documentation
  const response = await fetch(`${BASE_URL}/movies-app/movies-search?search=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(jwtToken),
  });
  if (!response.ok) throw new Error('Failed to search movies');
  const data = await response.json();
  return data.results.map(transformMovie);
};