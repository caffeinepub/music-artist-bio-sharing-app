import { Music2, Plus, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeView: 'gallery' | 'create';
  onViewChange: (view: 'gallery' | 'create') => void;
}

export function Header({ activeView, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Music2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Artist Discovery</h1>
            <p className="text-xs text-muted-foreground">Discover emerging talent</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant={activeView === 'gallery' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('gallery')}
            className="gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Button>
          <Button
            variant={activeView === 'create' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('create')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Artist</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
