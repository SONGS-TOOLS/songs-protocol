import { BigInt } from '@graphprotocol/graph-ts'
import { Sale, SaleOffer, WrappedSong } from '../generated/schema'
import {
    FundsWithdrawn,
    SharesSaleEnded,
    SharesSaleStarted,
    SharesSold
} from '../generated/templates/WSTokenManagement/WSTokenManagement'

export function handleSharesSaleStarted(event: SharesSaleStarted): void {
  let wsTokenManagementAddress = event.address
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress.toHexString())
  
  if (wrappedSong) {
    let saleOfferId = wsTokenManagementAddress.toHexString() + '-' + event.params.amount.toString()
    let saleOffer = new SaleOffer(saleOfferId)
    
    saleOffer.wrappedSong = wrappedSong.id
    saleOffer.seller = wrappedSong.creator
    saleOffer.amount = event.params.amount
    saleOffer.pricePerShare = event.params.price
    saleOffer.isActive = true
    saleOffer.createdAt = event.block.timestamp
    saleOffer.updatedAt = event.block.timestamp
    
    saleOffer.save()
  }
}

export function handleSharesSold(event: SharesSold): void {
  let wsTokenManagementAddress = event.address
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress.toHexString())
  
  if (wrappedSong) {
    let saleId = wsTokenManagementAddress.toHexString() + '-' + event.transaction.hash.toHexString()
    let sale = new Sale(saleId)
    
    sale.wrappedSong = wrappedSong.id
    sale.seller = wrappedSong.creator
    sale.buyer = event.params.buyer
    sale.amount = event.params.amount
    sale.pricePerShare = BigInt.fromI32(0) // We don't have access to the price in this event
    sale.timestamp = event.block.timestamp
    
    sale.save()
  }
}

export function handleSharesSaleEnded(event: SharesSaleEnded): void {
  let wsTokenManagementAddress = event.address
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress.toHexString())
  
  if (wrappedSong) {
    let saleOffers = wrappedSong.saleOffers
    for (let i = 0; i < saleOffers.length; i++) {
      let saleOffer = SaleOffer.load(saleOffers[i])
      if (saleOffer && saleOffer.isActive) {
        saleOffer.isActive = false
        saleOffer.updatedAt = event.block.timestamp
        saleOffer.save()
      }
    }
  }
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  // You can implement this if you want to track fund withdrawals
}