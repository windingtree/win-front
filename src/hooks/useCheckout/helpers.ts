import {
  BillingAddress,
  OfferIdAndQuantity,
  OrganizerInformation
} from '@windingtree/glider-types/dist/win';
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { getGroupMode } from '../useAccommodationsAndOffers/helpers';
export type BookingModeType = 'group' | 'normal' | undefined;

/**
 * Get the id of a offer if only one offer is used for a booking.
 */
export const getOfferId = (offers: OfferIdAndQuantity[] | undefined) => {
  if (!offers) return;

  return offers.map(({ offerId }) => offerId)[0];
};

export const getBookingMode = (
  offers: OfferIdAndQuantity[] | undefined
): BookingModeType => {
  if (!offers) return undefined;

  const roomCount = offers.reduce(getTotalRoomCountReducer, 0);
  const isGroupMode = getGroupMode(roomCount);
  const bookingMode = isGroupMode ? 'group' : 'normal';
  return bookingMode;
};

/**
 * Get the address formatted for sending it the BE.
 */
export const getNormalizedAddress = (address: BillingAddress) => {
  if (!address || !address.cityName || !address.countryCode) return;
  const { cityName, countryCode, street, postalCode, ...restAddress } = address;

  const normalizedAddress = {
    cityName: cityName.toUpperCase(),
    countryCode: countryCode.toUpperCase(),
    street: street?.toUpperCase(),
    postalCode: postalCode?.toUpperCase(),
    ...restAddress
  };

  return normalizedAddress;
};

/**
 * Get the organizerInfo formatted for sending it the BE.
 */
export const getNormalizedOrganizerInfo = (
  organizerInfo: OrganizerInformation,
  invoice: boolean
) => {
  const { billingInfo, ...restOrganizerInfo } = organizerInfo;
  const { address, ...restBillingInfo } = billingInfo || {};
  const normalizedAddress = address && getNormalizedAddress(address);
  const includeBillingInfo = invoice && normalizedAddress;

  const normalizedOrganizerInfo = {
    ...restOrganizerInfo,
    ...(includeBillingInfo && {
      billingInfo: {
        address: normalizedAddress,
        ...restBillingInfo
      }
    })
  };

  return normalizedOrganizerInfo;
};