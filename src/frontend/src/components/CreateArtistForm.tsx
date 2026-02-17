import { useState } from 'react';
import { useCreateArtistProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Music2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface CreateArtistFormProps {
  onSuccess: () => void;
}

export function CreateArtistForm({ onSuccess }: CreateArtistFormProps) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [biography, setBiography] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [soundcloudLink, setSoundcloudLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createArtistMutation = useCreateArtistProfile();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !genre.trim() || !biography.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await createArtistMutation.mutateAsync({
        id,
        name: name.trim(),
        genre: genre.trim(),
        biography: biography.trim(),
        image: imageBlob,
        spotifyLink: spotifyLink.trim() || null,
        soundcloudLink: soundcloudLink.trim() || null,
        youtubeLink: youtubeLink.trim() || null,
        instagramLink: instagramLink.trim() || null,
        twitterLink: twitterLink.trim() || null,
      });

      toast.success('Artist profile created successfully!');
      
      // Reset form
      setName('');
      setGenre('');
      setBiography('');
      setSpotifyLink('');
      setSoundcloudLink('');
      setYoutubeLink('');
      setInstagramLink('');
      setTwitterLink('');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);

      onSuccess();
    } catch (error) {
      console.error('Error creating artist profile:', error);
      toast.error('Failed to create artist profile. Please try again.');
    }
  };

  const isSubmitting = createArtistMutation.isPending;

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
          <Music2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Add New Artist</h2>
        <p className="text-muted-foreground">
          Share an emerging artist with the community. Fill in the details below to create their profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artist Information</CardTitle>
          <CardDescription>
            Fields marked with * are required. Add as much detail as possible to help others discover this artist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Artist Photo or Logo</Label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-48 rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Uploading: {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-accent/50"
                  >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                    <span className="mt-1 text-xs text-muted-foreground">Max 5MB</span>
                  </label>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Artist Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g., Pop, Rock, Hip-Hop"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">
                Biography <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Tell us about this artist's background, style, and story..."
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                {biography.length} characters
              </p>
            </div>

            {/* Music Platform Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Music Platform Links (Optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="spotify">Spotify</Label>
                  <Input
                    id="spotify"
                    type="url"
                    value={spotifyLink}
                    onChange={(e) => setSpotifyLink(e.target.value)}
                    placeholder="https://open.spotify.com/artist/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soundcloud">SoundCloud</Label>
                  <Input
                    id="soundcloud"
                    type="url"
                    value={soundcloudLink}
                    onChange={(e) => setSoundcloudLink(e.target.value)}
                    placeholder="https://soundcloud.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Social Media Links (Optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">X (Twitter)</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
