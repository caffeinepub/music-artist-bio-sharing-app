import { type ArtistProfile } from '../backend';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { SiSpotify, SiSoundcloud, SiYoutube, SiInstagram, SiX } from 'react-icons/si';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ArtistCardProps {
  artist: ArtistProfile;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const loadImage = async () => {
    if (artist.image && !imageUrl) {
      const url = artist.image.getDirectURL();
      setImageUrl(url);
    }
  };

  useState(() => {
    loadImage();
  });

  const truncateBio = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const socialLinks = [
    { icon: SiSpotify, url: artist.spotifyLink, label: 'Spotify', color: 'text-[#1DB954]' },
    { icon: SiSoundcloud, url: artist.soundcloudLink, label: 'SoundCloud', color: 'text-[#FF5500]' },
    { icon: SiYoutube, url: artist.youtubeLink, label: 'YouTube', color: 'text-[#FF0000]' },
    { icon: SiInstagram, url: artist.instagramLink, label: 'Instagram', color: 'text-[#E4405F]' },
    { icon: SiX, url: artist.twitterLink, label: 'X', color: 'text-foreground' },
  ].filter((link) => link.url);

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={imageUrl || '/assets/generated/artist-placeholder.dim_300x300.png'}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold">{artist.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {artist.genre}
            </Badge>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {truncateBio(artist.biography, 120)}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-4 pt-0">
          <div className="flex gap-2">
            {socialLinks.slice(0, 3).map((link, index) => (
              <a
                key={index}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:${link.color}`}
                onClick={(e) => e.stopPropagation()}
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
            {socialLinks.length > 3 && (
              <span className="text-xs text-muted-foreground">+{socialLinks.length - 3}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-1 text-xs"
          >
            View More
            <ExternalLink className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <img
                src={imageUrl || '/assets/generated/artist-placeholder.dim_300x300.png'}
                alt={artist.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <DialogTitle className="text-2xl">{artist.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  <Badge variant="secondary">{artist.genre}</Badge>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div>
                <h4 className="mb-2 font-semibold">Biography</h4>
                <p className="text-sm text-muted-foreground">{artist.biography}</p>
              </div>

              {socialLinks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-3 font-semibold">Connect</h4>
                    <div className="grid gap-2">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                        >
                          <link.icon className={`h-5 w-5 ${link.color}`} />
                          <span className="text-sm font-medium">{link.label}</span>
                          <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
