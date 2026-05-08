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
  similarMovies: movie.similar_movies?.map(transformMovie),
});

export const login = async (username: string, password: string): Promise<{ jwt_token: string }> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_msg || 'Login failed');
  }

  return response.json();
};

export const fetchTrendingMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies/trending`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }

  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchOriginalMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies/originals`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch original movies');
  }

  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchPopularMovies = async (jwtToken: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies/popular`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }

  const data = await response.json();
  return data.results.map(transformMovie);
};

export const fetchMovieDetails = async (jwtToken: string, movieId: string): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  const data = await response.json();
  return {
    ...transformMovie(data.movie_details),
    similarMovies: data.movie_details.similar_movies?.map(transformMovie),
  };
};

export const searchMovies = async (jwtToken: string, query: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movies/search?search=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  const data = await response.json();
  return data.results.map(transformMovie);
};
