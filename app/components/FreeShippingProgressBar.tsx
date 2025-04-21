import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

type FreeShippingProgressBarProps = {
  subtotalAmount: MoneyV2 | undefined;
  freeShippingThreshold: number;
  currencyCode: string;
};

export function FreeShippingProgressBar({
  subtotalAmount,
  freeShippingThreshold,
  currencyCode,
}: FreeShippingProgressBarProps) {
  const currentAmount = parseFloat(subtotalAmount?.amount || '0');
  const remainingAmount = Math.max(0, freeShippingThreshold - currentAmount);
  const progressPercentage = Math.min(
    100,
    (currentAmount / freeShippingThreshold) * 100,
  );

  if (remainingAmount === 0) {
    return (
        <div className="my-2 h-12">
        <p className="text-base text-center text-[#1B1F23] mb-2">
          Congratulations! You are eligible for free shipping
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm">$0</span>
          <div className="flex-grow bg-[#000000]/16 rounded-full h-1">
            <div
              className="bg-black h-1 rounded-full"
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
          <span className="text-sm">
            $
            {freeShippingThreshold}
          </span>
        </div>
      </div>
  
    );
  }

  return (
    <div className="my-2 h-12">
      <p className="text-base text-center text-[#1B1F23] mb-2">
        You are{' '}
        <span className="font-medium">
          $
          {remainingAmount.toFixed(2)}
        </span>{' '}
        away from eligible for free shipping
      </p>
      <div className="flex items-center space-x-2">
        <span className="text-sm">$0</span>
        <div className="flex-grow bg-[#000000]/16 rounded-full h-1">
          <div
            className="bg-black h-1 rounded-full"
            style={{width: `${progressPercentage}%`}}
          ></div>
        </div>
        <span className="text-sm">
          $
          {freeShippingThreshold}
        </span>
      </div>
    </div>
  );
} 