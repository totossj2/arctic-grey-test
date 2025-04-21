import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {useAsyncValue} from '@remix-run/react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
  count,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  count?: number;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  const renderHeading = () => {
    if (type === 'cart') {
      return (
        <span className='font-medium text-[#1B1F23] gap-2 text-[24px] md:text-[32px] flex items-center'>
          Your Bag {count && count > 0 && (
            <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 p-[10px] rounded-full bg-[#1B1F23] text-xs md:text-sm text-white font-regular">
              {count}
            </span>
          )}
        </span>
      );
    }
    return heading;
  };

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header className='flex items-center justify-between border-b border-gray-200'>
          <h3>{renderHeading()}</h3>
          <button className="close reset " onClick={close} aria-label="Close">
x

          </button>
        </header>
        <main className={type === 'cart' ? '' : 'px-5'}>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  useEffect(() => {
    if (type !== 'closed') {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to remove the class if the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [type]); // Re-run effect when type changes

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
