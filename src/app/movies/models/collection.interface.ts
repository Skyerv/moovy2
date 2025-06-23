export interface MovieCollection {
  id: string;
  title: string;
  description: string;
  movieIds: number[];
}

export function createEmptyMovieCollection(): MovieCollection {
  return {
    id: '',
    title: '',
    description: '',
    movieIds: [],
  };
}
