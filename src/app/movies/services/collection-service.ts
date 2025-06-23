import { Injectable } from '@angular/core';
import { MovieCollection } from '../models/collection.interface';

const STORAGE_KEY = 'movieCollections';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  constructor() {}

  getCollections(): MovieCollection[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveCollections(collections: MovieCollection[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }

  addCollection(collection: MovieCollection): void {
    const collections = this.getCollections();
    this.saveCollections([...collections, collection]);
  }

  addMoviesToCollection(collectionId: string, movieIds: number[]): void {
    const collections = this.getCollections();
    const updated = collections.map((c) =>
      c.id === collectionId
        ? { ...c, movieIds: [...new Set([...c.movieIds, ...movieIds])] }
        : c
    );
    this.saveCollections(updated);
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collections = this.getCollections();
    const updated = collections.map((c) =>
      c.id === collectionId
        ? { ...c, movieIds: c.movieIds.filter((id) => id !== movieId) }
        : c
    );
    this.saveCollections(updated);
  }

  getCollectionById(id: string): MovieCollection | undefined {
    return this.getCollections().find((c) => c.id === id);
  }
}
