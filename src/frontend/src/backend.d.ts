import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ArtistProfile {
    id: string;
    instagramLink?: string;
    spotifyLink?: string;
    youtubeLink?: string;
    twitterLink?: string;
    name: string;
    createdAt: bigint;
    biography: string;
    soundcloudLink?: string;
    genre: string;
    image?: ExternalBlob;
}
export interface backendInterface {
    createArtistProfile(id: string, name: string, genre: string, biography: string, image: ExternalBlob | null, spotifyLink: string | null, soundcloudLink: string | null, youtubeLink: string | null, instagramLink: string | null, twitterLink: string | null): Promise<void>;
    filterArtistsByGenre(genre: string): Promise<Array<ArtistProfile>>;
    getAllArtistProfiles(): Promise<Array<ArtistProfile>>;
    getAllGenres(): Promise<Array<string>>;
    getArtistProfileById(id: string): Promise<ArtistProfile>;
    searchArtistByName(searchTerm: string): Promise<Array<ArtistProfile>>;
}
