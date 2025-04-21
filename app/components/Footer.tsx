import {Link, Await} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Suspense, useState} from 'react';
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
  HeartIcon,
  CoffeeIcon,
  PlusIcon,
  MinusIcon,
} from './icons'; // Import new icon components
import {FooterContactColumn} from './FooterContactColumn'; // Import the new component

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const shopName = header?.shop?.name || 'UNCMFRT';
  const currentYear = new Date().getFullYear();
  const [emailSent, setEmailSent] = useState(false);
  const [emailValue, setEmailValue] = useState('');

  const handleSubscribeClick = () => {
    if (emailValue && emailValue.includes('@')) {
      console.log('Simulating email send for:', emailValue);
      setEmailSent(true);
      setEmailValue('');
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
    } else {
      console.log('Invalid email for simulation');
      setEmailSent(false);
    }
  };

  return (
    <footer id='footer' className="bg-[#F6F6F5] text-[#1B1F23]">
      <div className=" flex flex-col md:flex-row w-full flex-grow md:justify-between px-4 md:px-[40px] py-18">
        {/* Newsletter */}
        <div className="md:w-1/4 flex flex-col gap-8">
          <div className='flex flex-col gap-4'>
            <h3 className="text-lg md:text-2xl font-semibold">
              Be a Part of Our Journey
            </h3>
            <p className=" text-[16px] text-[#1B1F23]/80 leading-6">
              Welcome to UNCMFRT. Sign up for exclusive content and we'll send
              you 10% off.
            </p>
          </div>

          {/* Newsletter Form - Add action/method as needed */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex w-full">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-[20px] border bg-white border-[#DDDDDD] rounded-l-md focus:outline-none text-black placeholder:text-black/80 text-xs md:text-sm"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value);
                  setEmailSent(false);
                }}
                required
              />
              <button
                type="button"
                className="bg-[#1B1F23] text-white text-xs md:text-sm px-4 md:px-6 py-[13px] rounded-r-md hover:bg-gray-700"
                onClick={handleSubscribeClick}
              >
                Subscribe
              </button>
            </div>
            {emailSent && (
              <p className="text-sm text-green-600 mt-1">Successfully sent!</p>
            )}
          </div>
        </div>

        {/* Store Info Sections - Now handle accordions internally */}
        {/* This container stacks columns on mobile and rows them on desktop */}
        <div className="flex flex-col mt-6 md:mt-0 md:flex-row w-full md:w-fit md:gap-[40px]">
          {/* Removed the intermediate div. Place all columns directly here. */}
          <FooterLinkColumn
            title="About Us"
            links={[
              {title: 'Blog', url: '/blogs/news'},
              {title: 'Product Reviews', url: '/pages/reviews'},
              {title: 'Our Story', url: '/pages/about-us'},
              {title: 'Delivery', url: '/pages/delivery'},
            ]}
          />
          {/* Mobile Separator */}
          <div className="block md:hidden mx-auto w-full bg-[#DDDDDD]/50 h-[1px] my-3"></div>

          <FooterLinkColumn
            title="Support"
            links={[
              {title: 'Order Status', url: '/pages/order-status'},
              {title: 'Help Center', url: '/pages/help-center'},
              {title: 'Contact Us', url: '/pages/contact'},
              {title: 'Returns', url: '/policies/refund-policy'},
            ]}
          />
          {/* Mobile Separator */}
          <div className="block md:hidden mx-auto w-full bg-[#DDDDDD]/50 h-[1px] my-3"></div>

          <FooterLinkColumn
            title="Important Link"
            links={[
              {title: 'Maintenance', url: '/pages/maintenance'},
              {title: 'Warranty', url: '/pages/warranty'},
              {title: 'Canadian Customers', url: '/pages/canadian-customers'},
              {title: 'Setup', url: '/pages/setup'},
            ]}
          />
          {/* Mobile Separator */}
          <div className="block md:hidden mx-auto w-full bg-[#DDDDDD]/50 h-[1px] my-3"></div>

          <FooterLinkColumn
            title="Legal"
            links={[
              {title: 'Privacy Policy', url: '/policies/privacy-policy'},
              {title: 'Accessibility', url: '/pages/accessibility'},
              {
                title: 'Terms of Service',
                url: '/policies/terms-of-service',
              },
              {
                title: 'Affiliate Program',
                url: '/pages/affiliate-program',
              },
              {title: 'Articles', url: '/blogs/articles'},
            ]}
          />
          {/* NO separator after the last link column */}

          {/* Separator before Contact Us (Mobile Only) */}
          <div className="block md:hidden mx-auto w-full bg-[#DDDDDD]/50 h-[1px] my-3"></div>
          
        </div>
        {/* Contact Us Column (Always Visible) */}
        <FooterContactColumn />

      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col-reverse  md:flex-row md:justify-between px-4 md:px-[40px] py-3 border-t border-b border-black/10 text-center text-base text-[#1B1F23]/50">
        <p>
          © uncmfrt.com. All right reserved.
        </p>
        <Link to='https://arcticgrey.com/'>
          <p className=" text-[#1B1F23] md:flex md:flex-row md:items-center font-light gap-1">
            Made with <HeartIcon className="inline" /> and{' '}
            <CoffeeIcon className="inline" /> by Lorenzo from Arctic Grey
          </p>
        </Link>
      </div>
    </footer>
  );
}

// Modified FooterLinkColumn for animation and styling
function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: {title: string; url: string}[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-sm flex flex-col w-full md:w-fit h-fit">
      {/* Accordion Trigger (Mobile Only) - Consistent styling */}
      <button
        type="button"
        className="md:hidden flex justify-between items-center w-full py-3 font-medium text-base md:text-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`link-column-content-${title.replace(/\s+/g, '-')}`}
      >
        <span>{title}</span>
        {isOpen ? (
          <MinusIcon className="w-5 h-5" />
        ) : (
          <PlusIcon className="w-5 h-5" />
        )}
      </button>

      {/* Title (Desktop Only) */}
      <h3 className="hidden md:block text-lg font-medium flex-shrink-0 mb-6">
        {title}
      </h3>

      {/* Content List with Animation */}
      <div
        id={`link-column-content-${title.replace(/\s+/g, '-')}`}
        className={`overflow-hidden md:overflow-visible transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} md:max-h-none`}
      >
        <ul
          className={`flex flex-col gap-[14px] text-sm md:text-base md:pt-0 ${isOpen ? 'pt-3' : ''}`}
        >
          {links.map((link) => (
            <li key={link.title}>
              <FooterLink item={link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Helper component for individual links (handles internal/external)
function FooterLink({item}: {item: {title: string; url: string}}) {
  const url = item.url;
  const isExternal = !url.startsWith('/');

  if (isExternal) {
    return (
      <a
        href={url}
        key={item.title}
        rel="noopener noreferrer"
        target="_blank"
        className=" hover:text-gray-900 hover:underline whitespace-nowrap"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      key={item.title}
      prefetch="intent"
      to={url}
      className="text-[16px] hover:text-gray-900 hover:underline whitespace-nowrap"
    >
      {item.title}
    </Link>
  );
}
