import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type ArtistProfile = {
    id : Text;
    name : Text;
    genre : Text;
    biography : Text;
    image : ?Storage.ExternalBlob;
    spotifyLink : ?Text;
    soundcloudLink : ?Text;
    youtubeLink : ?Text;
    instagramLink : ?Text;
    twitterLink : ?Text;
    createdAt : Int;
  };

  module ArtistProfile {
    public func compareByCreatedAt(profile1 : ArtistProfile, profile2 : ArtistProfile) : Order.Order {
      if (profile1.createdAt > profile2.createdAt) { #less } else if (profile1.createdAt < profile2.createdAt) {
        #greater;
      } else { Text.compare(profile1.id, profile2.id) };
    };

    public func compareByName(profile1 : ArtistProfile, profile2 : ArtistProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  let artistProfiles = Map.empty<Text, ArtistProfile>();

  include MixinStorage();

  public shared ({ caller }) func createArtistProfile(
    id : Text,
    name : Text,
    genre : Text,
    biography : Text,
    image : ?Storage.ExternalBlob,
    spotifyLink : ?Text,
    soundcloudLink : ?Text,
    youtubeLink : ?Text,
    instagramLink : ?Text,
    twitterLink : ?Text,
  ) : async () {
    switch (artistProfiles.get(id)) {
      case (null) {
        let newProfile : ArtistProfile = {
          id;
          name;
          genre;
          biography;
          image;
          spotifyLink;
          soundcloudLink;
          youtubeLink;
          instagramLink;
          twitterLink;
          createdAt = Time.now();
        };
        artistProfiles.add(id, newProfile);
      };
      case (?_) { Runtime.trap("Artist ID already exists") };
    };
  };

  public query ({ caller }) func getAllArtistProfiles() : async [ArtistProfile] {
    artistProfiles.values().toArray().sort(ArtistProfile.compareByCreatedAt);
  };

  public query ({ caller }) func searchArtistByName(searchTerm : Text) : async [ArtistProfile] {
    let results = List.empty<ArtistProfile>();

    for (profile in artistProfiles.values()) {
      if (profile.name.toLower().contains(#text(searchTerm.toLower()))) {
        results.add(profile);
      };
    };

    results.toArray().sort(ArtistProfile.compareByName);
  };

  public query ({ caller }) func filterArtistsByGenre(genre : Text) : async [ArtistProfile] {
    let results = List.empty<ArtistProfile>();

    for (profile in artistProfiles.values()) {
      if (Text.equal(profile.genre, genre)) {
        results.add(profile);
      };
    };

    results.toArray().sort(ArtistProfile.compareByCreatedAt);
  };

  public query ({ caller }) func getArtistProfileById(id : Text) : async ArtistProfile {
    switch (artistProfiles.get(id)) {
      case (null) { Runtime.trap("Artist profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllGenres() : async [Text] {
    let genresList = List.empty<Text>();

    for (profile in artistProfiles.values()) {
      if (not genresList.values().any(func(g) { Text.equal(g, profile.genre) })) {
        genresList.add(profile.genre);
      };
    };

    genresList.toArray();
  };
};
