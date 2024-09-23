import { BigInt } from '@graphprotocol/graph-ts'
import { FundWithdrawal, Sale, SaleOffer, WrappedSong } from '../generated/schema'
import {
  FundsWithdrawn,
  SharesSaleEnded,
  SharesSaleStarted,
  SharesSold
} from '../generated/templates/WSTokenManagement/WSTokenManagement'

export function handleSharesSaleStarted(event: SharesSaleStarted): void {
  let wsTokenManagementAddress = event.address.toHexString()
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress)
  
  if (wrappedSong) {
    let saleOfferId = wsTokenManagementAddress + '-' + event.params.amount.toString()
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
  let wsTokenManagementAddress = event.address.toHexString()
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress)
  
  if (wrappedSong) {
    let saleId = wsTokenManagementAddress + '-' + event.transaction.hash.toHexString()
    let sale = new Sale(saleId)
    
    sale.wrappedSong = wrappedSong.id
    sale.seller = wrappedSong.creator
    sale.buyer = event.params.buyer
    sale.amount = event.params.amount
    sale.pricePerShare = BigInt.fromI32(0) // We don't have access to the price in this event
    sale.timestamp = event.block.timestamp
    
    sale.save()

    // Update the active sale offer
    let activeSaleOfferId = wsTokenManagementAddress + '-active'
    let activeSaleOffer = SaleOffer.load(activeSaleOfferId)
    if (activeSaleOffer) {
      activeSaleOffer.amount = activeSaleOffer.amount.minus(event.params.amount)
      if (activeSaleOffer.amount.equals(BigInt.fromI32(0))) {
        activeSaleOffer.isActive = false
      }
      activeSaleOffer.updatedAt = event.block.timestamp
      activeSaleOffer.save()
    }
  }
}

export function handleSharesSaleEnded(event: SharesSaleEnded): void {
  let wsTokenManagementAddress = event.address.toHexString()
  let activeSaleOfferId = wsTokenManagementAddress + '-active'
  let activeSaleOffer = SaleOffer.load(activeSaleOfferId)
  
  if (activeSaleOffer) {
    activeSaleOffer.isActive = false
    activeSaleOffer.updatedAt = event.block.timestamp
    activeSaleOffer.save()
  }
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  let wsTokenManagementAddress = event.address.toHexString()
  let wrappedSong = WrappedSong.load(wsTokenManagementAddress)

  if (wrappedSong) {
    let withdrawalId = wsTokenManagementAddress + '-' + event.transaction.hash.toHexString()
    let withdrawal = new FundWithdrawal(withdrawalId)

    withdrawal.wrappedSong = wrappedSong.id
    withdrawal.to = event.params.to
    withdrawal.amount = event.params.amount
    withdrawal.timestamp = event.block.timestamp

    withdrawal.save()
  }
}