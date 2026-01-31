'use client';

import * as React from 'react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { FilterTag } from '@/components/FilterTag';
import { BotCard, BotCardProfile } from '@/components/BotCard';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Label } from '@/components/Label';
import { countActiveFilters } from '@/lib/utils';
import { RetroCard } from '@/components/RetroCard';

// Types

interface Filters {
  search: string;
  harness: string;
  sortBy: 'updated' | 'name' | 'skills';
}

const HARNESS_OPTIONS = ['ALL', 'CLAWDBOT', 'CLAUDE', 'PI'] as const;
const PAGE_SIZE = 12;

// Transform database profile to BotCardProfile format
function transformProfile(profile: any): BotCardProfile {
  return {
    id: profile._id,
    slug: profile.slug,
    name: profile.name,
    owner: profile.owner,
    harness: profile.harness,
    version: profile.version,
    description: profile.description,
    skills: profile.skills,
    mcps: profile.mcps,
    clis: profile.clis,
    llm: {
      primary: profile.modelPrimary,
      fallbacks: profile.modelFallbacks,
    },
    avatar: profile.avatar,
    updatedAt: profile.updateTime ? new Date(profile.updateTime) : new Date(),
  };
}

// Loading skeleton component
function BotCardSkeleton() {
  return (
    <RetroCard className="px-4 py-3 opacity-50">
      <div className="flex items-center justify-between border-b border-[var(--color-border-strong)] pb-2">
        <div className="h-3 w-20 bg-[var(--color-bg-secondary)] animate-pulse" />
        <div className="h-3 w-16 bg-[var(--color-bg-secondary)] animate-pulse" />
      </div>
      <div className="flex items-start gap-4 py-3">
        <div className="h-[6.25rem] w-[6.25rem] bg-[var(--color-bg-secondary)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-[var(--color-bg-secondary)] animate-pulse" />
          <div className="h-3 w-24 bg-[var(--color-bg-secondary)] animate-pulse" />
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] animate-pulse" />
        </div>
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="grid grid-cols-[96px_1fr] items-center gap-2 py-2 border-t border-[var(--color-border-strong)]">
          <div className="h-3 w-12 bg-[var(--color-bg-secondary)] animate-pulse" />
          <div className="h-4 w-20 bg-[var(--color-bg-secondary)] animate-pulse" />
        </div>
      ))}
    </RetroCard>
  );
}

// Sub-components

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const inputId = React.useId();

  return (
    <div className="flex-1 min-w-[200px]">
      <label htmlFor={inputId} className="block mb-1">
        <Label>SEARCH</Label>
      </label>
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter by name..."
        variant="dark"
      />
    </div>
  );
}

interface HarnessFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function HarnessFilter({ value, onChange }: HarnessFilterProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {HARNESS_OPTIONS.map((harness) => (
        <FilterTag
          key={harness}
          active={value === harness.toLowerCase()}
          onClick={() => onChange(harness.toLowerCase())}
        >
          {harness}
        </FilterTag>
      ))}
    </div>
  );
}

interface SortSelectProps {
  value: string;
  onChange: (value: 'updated' | 'name' | 'skills') => void;
}

function SortSelect({ value, onChange }: SortSelectProps) {
  const selectId = React.useId();

  return (
    <div className="min-w-[140px]">
      <label htmlFor={selectId} className="block mb-1">
        <Label>SORT</Label>
      </label>
      <Select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as 'updated' | 'name' | 'skills')}
        variant="bold"
      >
        <option value="updated">Updated</option>
        <option value="name">Name</option>
        <option value="skills">Skills</option>
      </Select>
    </div>
  );
}

// Main page component

/**
 * Discover page for browsing and filtering bot profiles.
 * Fetches real data from Convex with pagination, search, filter, and sort.
 */
export default function DiscoverPage() {
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    harness: 'all',
    sortBy: 'updated',
  });

  // Debounce search to avoid excessive re-fetching
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch paginated data from Convex
  const queryArgs = React.useMemo(() => {
    const args: { searchQuery?: string; harness?: string; sortBy: 'updated' | 'name' | 'skills' } = {
      sortBy: filters.sortBy,
    };
    if (debouncedSearch) {
      args.searchQuery = debouncedSearch;
    }
    if (filters.harness !== 'all') {
      args.harness = filters.harness;
    }
    return args;
  }, [debouncedSearch, filters.harness, filters.sortBy]);

  const {
    results: profiles,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.botProfiles.listProfilesPaginated,
    queryArgs,
    { initialNumItems: PAGE_SIZE }
  );

  const activeFiltersCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  // Transform profiles for display
  const botProfiles = React.useMemo(() => {
    return profiles.map(transformProfile);
  }, [profiles]);

  // Handlers
  const handleSearchChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleHarnessChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, harness: value }));
  }, []);

  const handleSortChange = React.useCallback((value: 'updated' | 'name' | 'skills') => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  }, []);

  const handleLoadMore = React.useCallback(() => {
    loadMore(PAGE_SIZE);
  }, [loadMore]);

  const isLoading = status === 'LoadingFirstPage';
  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  return (
    <div className="max-w-7xl mx-auto mb-4">
      {/* Clean inline actions bar - not a panel */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 pb-4 border-b border-[var(--color-border-strong)]">
        <SearchInput value={filters.search} onChange={handleSearchChange} />
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <HarnessFilter
            value={filters.harness}
            onChange={handleHarnessChange}
          />
          <SortSelect value={filters.sortBy} onChange={handleSortChange} />
        </div>
      </div>

      {/* Results info */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs uppercase">
          {isLoading ? 'LOADING...' : `RESULTS: ${botProfiles.length}${canLoadMore ? '+' : ''}`}
        </span>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {activeFiltersCount > 0 ? `FILTERS: ${activeFiltersCount}` : ''}
        </span>
      </div>

      {/* Bot grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <BotCardSkeleton key={i} />
          ))
        ) : botProfiles.length === 0 ? (
          // Empty state
          <div className="col-span-full py-12 text-center">
            <p className="text-[var(--color-text-secondary)] mb-2">NO_BOTS_FOUND</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          // Bot cards
          botProfiles.map((bot) => (
            <BotCard key={bot.id} profile={bot} />
          ))
        )}
      </div>

      {/* Load more button */}
      {(canLoadMore || isLoadingMore) && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 text-sm font-semibold uppercase tracking-wider
                       border border-[var(--color-border-strong)]
                       bg-[var(--color-bg-secondary)]
                       text-[var(--color-text-primary)]
                       hover:bg-[var(--color-bg-hover)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isLoadingMore ? 'LOADING...' : 'LOAD_MORE'}
          </button>
        </div>
      )}
    </div>
  );
}
