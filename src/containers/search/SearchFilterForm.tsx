import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../../components/hook-form';
import { RHFArrayCheckbox } from '../../components/hook-form/RHFArrayCheckbox';
import Iconify from '../../components/Iconify';
import {
  PriceRange,
  useAccommodationsAndOffers
} from '../../hooks/useAccommodationsAndOffers';
import { useUserSettings } from '../../hooks/useUserSettings';
import { filterAccommodationsByPriceRanges } from '../../utils/accommodation';
import { emptyFunction } from '../../utils/common';
import { stringToNumber } from '../../utils/strings';

export interface SearchFilterFormProps {
  onCloseClick?: () => void;
  onSubmitClick?: (...args: unknown[]) => void;
}

interface SearchFilterFormData {
  priceRanges: string[];
}

export const SearchFilterForm = ({
  onCloseClick = emptyFunction,
  onSubmitClick = emptyFunction
}: SearchFilterFormProps) => {
  const fieldName = 'priceRanges';
  const theme = useTheme();
  const [totalAccommodationsSelected, setTotalAccommodationsSelected] = useState(0);

  const { accommodations } = useAccommodationsAndOffers();
  const { preferredCurrencyCode } = useUserSettings();

  const methods = useForm<SearchFilterFormData>({
    defaultValues: { priceRanges: [] }
  });

  const { handleSubmit, watch, reset } = methods;
  const priceRanges = watch(fieldName);

  // TO-DO: convert ranges from USD to preferredCurrency
  const defaultPriceRanges: PriceRange[] = useMemo(
    () => [
      {
        lowestPrice: {
          currency: preferredCurrencyCode,
          price: 20
        },
        highestPrice: {
          currency: preferredCurrencyCode,
          price: 50
        }
      },
      {
        lowestPrice: {
          currency: preferredCurrencyCode,
          price: 50
        },
        highestPrice: {
          currency: preferredCurrencyCode,
          price: 100
        }
      },
      {
        lowestPrice: {
          currency: preferredCurrencyCode,
          price: 100
        },
        highestPrice: {
          currency: preferredCurrencyCode,
          price: 150
        }
      },
      {
        lowestPrice: {
          currency: preferredCurrencyCode,
          price: 150
        },
        highestPrice: {
          currency: preferredCurrencyCode,
          price: 200
        }
      },
      {
        lowestPrice: {
          currency: preferredCurrencyCode,
          price: 200
        },
        highestPrice: {
          currency: preferredCurrencyCode,
          price: Infinity
        }
      }
    ],
    [preferredCurrencyCode]
  );

  // categorize accommodations into price ranges
  const accommodationsWithinPriceRanges = useMemo(() => {
    return defaultPriceRanges.map((priceRange) => {
      return filterAccommodationsByPriceRanges(accommodations, priceRange);
    });
  }, [accommodations]);

  // update the 'stays' count to the total number of accommodation
  // categories selected
  useEffect(() => {
    const selectedCount = priceRanges.reduce((sum, filteredIndex) => {
      const idx = stringToNumber(filteredIndex, undefined, false);
      if (!idx) return sum;
      return sum + accommodationsWithinPriceRanges[idx].length;
    }, 0);

    setTotalAccommodationsSelected(selectedCount);
  }, [priceRanges]);

  const onSubmit = useCallback(
    (formData) => {
      // process check boxes
      // get all selected indexes and build actual price range array
      const selectedPriceRanges = (formData as SearchFilterFormData).priceRanges.map(
        (stringIndex) => defaultPriceRanges[Number(stringIndex)]
      );

      // call onSubmit callback with values
      onSubmitClick(selectedPriceRanges);
    },
    [defaultPriceRanges, onSubmitClick]
  );

  // construct label for a given price range
  const getLabel = (priceRange: PriceRange) => {
    const { lowestPrice, highestPrice } = priceRange;
    return `${currencySymbolMap[lowestPrice.currency]}${lowestPrice.price}${
      highestPrice.price === Infinity
        ? '+'
        : `- ${currencySymbolMap[highestPrice.currency]}${highestPrice.price}`
    }`;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          minWidth: '260px'
        }}
      >
        <CardHeader
          title={'Filter by price'}
          titleTypographyProps={{
            variant: 'h6'
          }}
          action={
            <IconButton onClick={onCloseClick}>
              <Iconify icon="ci:close-big" />
            </IconButton>
          }
        />
        <CardContent
          sx={{
            fontSize: theme.typography.body2
          }}
        >
          <Stack>
            {defaultPriceRanges.map((priceRange, index) => {
              return (
                <Stack
                  key={index}
                  justifyContent={'space-between'}
                  direction={'row'}
                  alignItems={'center'}
                >
                  <RHFArrayCheckbox
                    label={getLabel(priceRange)}
                    name={fieldName}
                    value={index.toString()}
                  />
                  <Typography color={theme.palette.grey[500]}>
                    {accommodationsWithinPriceRanges[index].length}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'space-between',
            px: 3
          }}
        >
          <Link
            sx={{
              fontSize: theme.typography.caption,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => reset()}
          >
            Clear all
          </Link>
          <Button
            size="small"
            variant="contained"
            sx={{
              fontSize: theme.typography.caption,
              mb: 1
            }}
            type="submit"
            disabled={!accommodations.length}
          >
            Show {totalAccommodationsSelected || accommodations.length} stay(s)
          </Button>
        </CardActions>
      </Card>
    </FormProvider>
  );
};
