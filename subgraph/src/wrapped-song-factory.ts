import { WrappedSongCreated as WrappedSongCreatedEvent } from "../generated/WrappedSongFactory/WrappedSongFactory"
import { WrappedSong } from "../generated/schema"

export function handleWrappedSongCreated(event: WrappedSongCreatedEvent): void {
  let wrappedSong = new WrappedSong(event.params.wrappedSongSmartAccount.toHexString())
  wrappedSong.address = event.params.wrappedSongSmartAccount
  wrappedSong.creator = event.params.owner
  wrappedSong.status = "Created"
  wrappedSong.createdAt = event.block.timestamp
  wrappedSong.save()
}