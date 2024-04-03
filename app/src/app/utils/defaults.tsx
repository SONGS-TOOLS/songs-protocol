import { MusicMetadata } from '@/components/FormMetadata';

export const defaultBaseMusicMetadata: MusicMetadata = {
    name: `Enter song title here (${new Date().toLocaleString('en-US', { timeZone: 'UTC' })})`, // Example placeholder value with current date, minutes, and seconds
    description: `Descrition song`,
    attributes: [
      { trait_type: "Artist", value: "Gordo" }, // Prefilled example attribute
      { trait_type: "Year", value: "2024" }, // Prefilled example attribute
      { trait_type: "Genre", value: "Electronic" }, // Additional attribute
    ],
    external_url: "http://example.com/path/to/track/info",
    animation_url: "http://example.com/path/to/animation",
    main_artists: "Artist Name",
    production_year: new Date().getFullYear().toString(), // Defaults to current year
    lyrics: "Your lyrics go here...",
    explicit_content: false, // Boolean field example
    cover: "http://example.com/path/to/your/cover.jpg", // Example cover URL
  };
  