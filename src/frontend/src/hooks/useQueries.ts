import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type ArtistProfile, ExternalBlob } from '../backend';

export function useGetAllArtistProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile[]>({
    queryKey: ['artistProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArtistProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchArtistByName(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile[]>({
    queryKey: ['artistProfiles', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm) return [];
      return actor.searchArtistByName(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

export function useFilterArtistsByGenre(genre: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile[]>({
    queryKey: ['artistProfiles', 'genre', genre],
    queryFn: async () => {
      if (!actor || !genre || genre === 'all') return [];
      return actor.filterArtistsByGenre(genre);
    },
    enabled: !!actor && !isFetching && !!genre && genre !== 'all',
  });
}

export function useGetAllGenres() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGenres();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArtistProfileById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile>({
    queryKey: ['artistProfile', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getArtistProfileById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateArtistProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      genre: string;
      biography: string;
      image: ExternalBlob | null;
      spotifyLink: string | null;
      soundcloudLink: string | null;
      youtubeLink: string | null;
      instagramLink: string | null;
      twitterLink: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.createArtistProfile(
        params.id,
        params.name,
        params.genre,
        params.biography,
        params.image,
        params.spotifyLink,
        params.soundcloudLink,
        params.youtubeLink,
        params.instagramLink,
        params.twitterLink
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}
