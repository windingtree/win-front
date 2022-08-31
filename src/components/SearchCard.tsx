import { CSSProperties, forwardRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { emptyFunction } from '../utils/common';
import { Stack, Paper, Typography } from '@mui/material';
import Image from './Image';
import Iconify from './Iconify';
import { AccommodationWithId } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import defaultImage from '../images/cities/berlin.jpeg';

export interface SearchCardProps {
  facility: AccommodationWithId;
  isSelected?: boolean;
  onSelect?: (...args) => void;
}
const priceText = (prices: number[]) =>
  Math.min(...prices) === Math.max(...prices)
    ? `${Math.max(...prices)}`
    : `${Math.min(...prices)} - ${Math.max(...prices)}`;

export const SearchCard = forwardRef<HTMLDivElement, SearchCardProps>(
  ({ facility, isSelected, onSelect = emptyFunction }, ref) => {
    const navigate = useNavigate();
    const { winWidth } = useWindowsDimension();
    const selectedStyle: CSSProperties = isSelected
      ? {
          position: 'relative'
        }
      : {};
    const responsiveStyle: CSSProperties =
      winWidth < 900
        ? {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }
        : {};

    const prices = useMemo(
      () => facility.offers.map((o) => Number(o.price.public)),
      [facility]
    );
    const handleSelect = useCallback(() => onSelect(facility.id), []);

    if (facility.offers.length < 1) {
      return null;
    }

    return (
      <Paper
        ref={ref}
        onClick={() => navigate(`/facility/${facility.id}`)}
        onMouseOver={handleSelect}
        style={selectedStyle}
        sx={{ borderRadius: 2, bgcolor: 'background.neutral' }}
      >
        <Stack spacing={1} sx={{ ...responsiveStyle, mb: 1 }}>
          <Stack spacing={1} sx={{ p: 2, pb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="subtitle1">{facility.name}</Typography>
              <Stack direction="row" alignItems="center">
                <Typography variant="subtitle1">{facility.rating}</Typography>
                <Iconify icon={'clarity:star-solid'} width={12} height={12} />
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography textTransform="capitalize" variant="caption">
                  {facility.type}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon={'fa-solid:money-bill-wave'} width={16} height={16} />
                <Typography variant="caption">
                  {priceText(prices)} {facility.offers[0].price.currency} night
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack sx={{ p: 1 }}>
            <Image
              src={facility.media[0] !== undefined ? facility.media[0].url : defaultImage}
              sx={{
                borderRadius: 1.5,
                maxWidth: winWidth < 900 ? 200 : null
              }}
            />
          </Stack>
        </Stack>
      </Paper>
    );
  }
);