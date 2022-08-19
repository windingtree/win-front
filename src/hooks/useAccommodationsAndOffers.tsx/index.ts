import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAccommodationsAndOffers } from './api';
import {
  getAccommodationById,
  getActiveAccommodations,
  normalizeAccommodations,
  getOffersById,
  normalizeOffers
} from './helpers';

type SearchType = {
  location?: string;
  date?: [string, string];
  roomCount?: number;
  adultCount?: number;
  childrenCount?: number;
} | void;

export const useAccommodationsAndOffers = (props: SearchType) => {
  const { data, refetch, error, isLoading, isFetching } = useQuery(
    ['search-accommodations'],
    async () => {
      const result = await fetchAccommodationsAndOffers({
        location: props?.location,
        date: props?.date,
        roomCount: props?.roomCount,
        adultCount: props?.adultCount,
        childrenCount: props?.childrenCount
      });

      return result;
    },
    { enabled: false }
  );

  const accommodations = useMemo(
    () => normalizeAccommodations(data?.accommodations),
    [data]
  );
  const offers = useMemo(() => normalizeOffers(data?.offers), [data]);

  return {
    getOffersById,
    getAccommodationById,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    offers,
    refetch,
    data,
    error,
    isLoading,
    isFetching
  };
};
