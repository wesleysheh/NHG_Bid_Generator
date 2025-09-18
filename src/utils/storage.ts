import { Bid } from '../types';

const STORAGE_KEY = 'northHouseBids';

export const saveBid = (bid: Bid): void => {
  const existingBids = getAllBids();
  const updatedBids = [...existingBids, bid];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBids));
};

export const getAllBids = (): Bid[] => {
  const bidsJson = localStorage.getItem(STORAGE_KEY);
  if (!bidsJson) return [];
  
  try {
    const bids = JSON.parse(bidsJson);
    return bids.map((bid: any) => ({
      ...bid,
      createdAt: new Date(bid.createdAt)
    }));
  } catch {
    return [];
  }
};

export const getBidById = (id: string): Bid | undefined => {
  const bids = getAllBids();
  return bids.find(bid => bid.id === id);
};

export const updateBid = (id: string, updatedBid: Bid): void => {
  const bids = getAllBids();
  const index = bids.findIndex(bid => bid.id === id);
  if (index !== -1) {
    bids[index] = updatedBid;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bids));
  }
};

export const deleteBid = (id: string): void => {
  const bids = getAllBids();
  const filteredBids = bids.filter(bid => bid.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBids));
};