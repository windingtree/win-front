import { Payment } from './PaymentCard';
import { CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { getNetworkInfo } from '../config';
import Logger from '../utils/logger';
import { Chain } from '@web3modal/ethereum';

// Usage
const logger = Logger('CurrencySelector');

export interface CheckoutPrice {
  currency: string;
}

export interface PriceSelectProps {
  payment?: Payment;
  network?: Chain;
  onQuote(withQuote: boolean): void;
}

export const CurrencySelector = ({ payment, network, onQuote }: PriceSelectProps) => {
  const [currency, setCurrency] = useState<string | null>(
    payment ? payment.currency : null
  );

  const options = useMemo<CheckoutPrice[]>(
    () =>
      payment
        ? [
            {
              currency: payment.currency
            },
            ...(payment.quote
              ? [
                  {
                    currency: payment.quote.sourceCurrency ?? 'USD'
                  }
                ]
              : [])
          ]
        : [],
    [payment]
  );

  const tokens = useMemo<CryptoAsset[]>(() => {
    if (!payment || !network) {
      return [];
    }
    const chain = getNetworkInfo(network.id);
    return [...chain.contracts.assets.filter((a) => a.currency === payment.currency)];
  }, [network, payment]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = (event.target as HTMLInputElement).value;
      setCurrency(newValue);
      logger.debug('Currency selected:', newValue);
      const nextPrice = options.find((o) => o.currency === newValue) ?? null;
      const withQuote = nextPrice?.currency === 'USD';
      onQuote(withQuote);
      logger.debug('Is with quote selected:', withQuote);
    },
    [onQuote]
  );

  useEffect(() => {
    if (payment && payment.quote && tokens.length === 0) {
      setCurrency('USD');
      logger.debug('Currency automatically selected: USD');
      onQuote(true);
      logger.debug('Checkout price updated:', true);
    }
  }, [payment, tokens, onQuote]);

  if (!payment || !network) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel id="controlled-currency-selector">
        {tokens.length > 0
          ? 'Select which currency you would like to pay with'
          : 'There is no supported stablecoin for this currency, please select a USD pegged stablecoin'}
      </FormLabel>
      <RadioGroup
        aria-labelledby="controlled-currency-selector"
        name="controlled-currency-selector"
        value={currency}
        onChange={handleChange}
        sx={{
          display: 'inline-block'
        }}
      >
        {options.map((p, index) => (
          <FormControlLabel
            key={index}
            control={<Radio />}
            value={p.currency}
            label={`Pay in ${p.currency}`}
            disabled={tokens.length === 0 && p.currency !== 'USD'}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
