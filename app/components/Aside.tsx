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
            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_10435_5635)">
            <path d="M8.87423 8.01266L14.7149 2.17178C15.095 1.79185 15.095 1.17756 14.7149 0.797639C14.335 0.417714 13.7207 0.417714 13.3408 0.797639L7.49992 6.63852L1.65921 0.797639C1.27911 0.417714 0.665002 0.417714 0.285077 0.797639C-0.0950257 1.17756 -0.0950257 1.79185 0.285077 2.17178L6.12578 8.01266L0.285077 13.8535C-0.0950257 14.2335 -0.0950257 14.8477 0.285077 15.2277C0.474417 15.4172 0.72337 15.5124 0.972145 15.5124C1.22092 15.5124 1.4697 15.4172 1.65921 15.2277L7.49992 9.38679L13.3408 15.2277C13.5303 15.4172 13.7791 15.5124 14.0279 15.5124C14.2766 15.5124 14.5254 15.4172 14.7149 15.2277C15.095 14.8477 15.095 14.2335 14.7149 13.8535L8.87423 8.01266Z" fill="black"/>
            </g>
            <defs>
            <clipPath id="clip0_10435_5635">
            <rect width="15" height="15" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
            </defs>
            </svg>

          </button>
        </header>
        <main>{children}</main>
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
