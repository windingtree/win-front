import type {
  WinAccommodation,
  Offer,
  WinPricedOffer,
  BookingsAuthResponse,
  OrganizerInformation,
  GroupBookingDeposits,
  Quote,
  Price
} from '@windingtree/glider-types/dist/win';
import type { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import { AccommodationWithId } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { PriceRange } from '../hooks/useAccommodationsAndOffers';
import { CurrencyCode } from '../hooks/useCurrencies';
// import type {
//   Web3ModalProvider,
//   Web3ModalSignInFunction,
//   Web3ModalSignOutFunction
// } from '../hooks/useWeb3Modal';

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

interface OfferPreferredCurrencyPrice {
  preferredCurrencyPrice?: Price;
}

export type OfferRecord = Offer & GenericStateRecord & OfferPreferredCurrencyPrice;
export type FacilityRecord = WinAccommodation & GenericStateRecord;

export interface Address {
  addressLine: string[];
  country: string;
  city: string;
  state: string;
  postalCode: string;
  premise: string;
}

export interface Phone {
  areaCityCode: string;
  countryAccessCode: string;
  phoneNumber: string;
}

export interface Amenity {
  name: string;
  description: string;
  otaCode: string;
}

export interface MaximumOccupancy {
  adults: number;
  children: number;
}

export interface RoomCustomData {
  roomId: string;
  rateId: string;
  rateName: string;
  rateDescription: string;
  roomName: string;
}

export interface Policies {
  [key: string]: string;
}

export interface CheckInOutPolicy {
  checkOutTime: `${number}:${number}:${number}`;
  checkInTime: `${number}:${number}:${number}`;
}
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthdate: Date | null;
  emailAddress: string;
  phoneNumber: string;
}

export interface OfferCheckoutType extends OfferRecord {
  quantity: string;
}

export interface CheckOut extends WinPricedOffer {
  personalInfo?: PersonalInfo;
  facilityId: string;
}

export interface SearchParams {
  place: string;
  arrival: string;
  departure: string;
  roomCount: number;
  children: number;
  adults: number;
}

export interface BookingInfoType {
  adultCount?: number;
  roomCount?: number;
  location?: string;
  date?: {
    arrival: Date;
    departure: Date;
  };
  accommodation?: AccommodationWithId;
  offers?: OfferCheckoutType[];

  pricing?: GroupBookingDeposits;
  providerId?: string;
  serviceId?: string;
  requestId?: string;
  invoice?: boolean;
  quote?: Quote;
}
export interface UserSettings {
  preferredCurrencyCode: CurrencyCode;
}

export interface State {
  facilities: FacilityRecord[];
  offers: OfferRecord[];
  authentication: {
    token?: string;
    timestamp: number;
  };
  organizerInfo?: OrganizerInformation;
  bookingInfo?: BookingInfoType;
  checkout?: CheckOut;
  selectedNetwork?: NetworkInfo;
  selectedAsset?: CryptoAsset;
  searchParams?: SearchParams;
  selectedFacilityId?: string;
  walletAuth?: BookingsAuthResponse;
  userSettings: UserSettings;
  priceFilter: PriceRange[];
  [key: string]: unknown | GenericStateRecord[];
}
