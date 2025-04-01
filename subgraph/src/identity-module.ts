import {
    IdentityRegistryUpdated,
  } from "../generated/IdentityModule/IdentityModule";
  import {
    WrappedSong,
  } from "../generated/schema";

  export function handleIdentityRegistryUpdated(event: IdentityRegistryUpdated): void {
    const wrappedSong = WrappedSong.load(event.params.wrappedSong);
    if (!wrappedSong) {
      return;
  }
  if(event.params.registryType === "ISRC") {
  wrappedSong.isrc = event.params.value;
  }
  wrappedSong.save();   
}