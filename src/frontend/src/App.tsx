import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArtistGallery } from './components/ArtistGallery';
import { CreateArtistForm } from './components/CreateArtistForm';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  const [activeView, setActiveView] = useState<'gallery' | 'create'>('gallery');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1">
          {activeView === 'gallery' ? (
            <ArtistGallery />
          ) : (
            <CreateArtistForm onSuccess={() => setActiveView('gallery')} />
          )}
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
