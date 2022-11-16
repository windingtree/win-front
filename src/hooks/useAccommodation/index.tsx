import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccommodationsAndOffersHelpers } from '../useAccommodationsAndOffers/useAccommodationsAndOffersHelpers';
import { useUserSettings } from '../useUserSettings';
import {
  AccommodationResponseType,
  fetchAccommodation,
  fetchOffers,
  OffersResponseType
} from './api';

export interface SearchPropsType {
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
}

export interface UseAccommodationProps {
  id?: string;
  searchProps?: SearchPropsType;
}

export const useAccommodation = (props: UseAccommodationProps) => {
  const { preferredCurrencyCode } = useUserSettings();
  const { normalizeOffers } = useAccommodationsAndOffersHelpers();
  const { id, searchProps } = props || {};

  const accommodationQuery = useQuery<AccommodationResponseType | undefined, Error>(
    ['accommodation-details', id],
    async () => {
      if (!id) return;
      return await fetchAccommodation(id);
    }
  );

  const offerExpirationTime = 25 * 60 * 1000;
  const offersQuery = useQuery<OffersResponseType | undefined, Error>(
    ['accommodation-offers', id],
    async () => {
      console.log('JOO');
      console.log(id, searchProps);
      if (!id || !searchProps) return;

      const { arrival, departure, roomCount, adultCount } = searchProps;

      if (!arrival || !departure || !roomCount || !adultCount) return;
      return await fetchOffers({ id, searchProps });
    },
    {
      //    TODO: get the offers from the cache
      // initialData: () => {
      //   const cache = queryClient.getQueryData(['accommodations-and-offers']) as
      //     | AccommodationsAndOffersResponse
      //     | undefined;

      // },
      enabled: false,
      cacheTime: offerExpirationTime,
      refetchInterval: offerExpirationTime
    }
  );

  const { data, ...restOffersQuery } = offersQuery;

  const { offers, ...restData } = data || {};

  const normalizedOffers = useMemo(
    () => data?.offers && normalizeOffers(offers, offersQuery.data?.accommodations),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode, normalizeOffers]
  );

  return {
    accommodationQuery,
    offersQuery: {
      data: { offers: normalizedOffers, ...restData },
      ...restOffersQuery
    }
  };
};
