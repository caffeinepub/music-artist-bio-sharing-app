import { useState } from 'react';
import { useGetAllArtistProfiles, useSearchArtistByName, useFilterArtistsByGenre, useGetAllGenres } from '../hooks/useQueries';
import { ArtistCard } from './ArtistCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ArtistGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [activeSearch, setActiveSearch] = useState('');

  const { data: allArtists, isLoading: isLoadingAll } = useGetAllArtistProfiles();
  const { data: searchResults, isLoading: isSearching } = useSearchArtistByName(activeSearch);
  const { data: filteredArtists, isLoading: isFiltering } = useFilterArtistsByGenre(selectedGenre);
  const { data: genres } = useGetAllGenres();

  const handleSearch = () => {
    setActiveSearch(searchTerm);
    setSelectedGenre('all');
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setActiveSearch('');
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSelectedGenre('all');
  };

  const isLoading = isLoadingAll || isSearching || isFiltering;
  
  const displayedArtists = activeSearch 
    ? searchResults 
    : selectedGenre !== 'all' 
    ? filteredArtists 
    : allArtists;

  const hasActiveFilters = activeSearch || selectedGenre !== 'all';

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Hero banner"
          className="h-48 w-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Discover New Artists
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Explore emerging talent from around the world. Search by name or filter by genre to find your next favorite artist.
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search artists by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} size="default">
            Search
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select value={selectedGenre} onValueChange={handleGenreChange}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres?.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Info */}
      {hasActiveFilters && (
        <div className="mb-6 text-sm text-muted-foreground">
          {activeSearch && (
            <p>
              Showing results for <span className="font-medium text-foreground">"{activeSearch}"</span>
            </p>
          )}
          {selectedGenre !== 'all' && (
            <p>
              Filtered by genre: <span className="font-medium text-foreground">{selectedGenre}</span>
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading artists...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayedArtists && displayedArtists.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No artists found</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria'
              : 'Be the first to add an artist to the gallery!'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Artist Grid */}
      {!isLoading && displayedArtists && displayedArtists.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
