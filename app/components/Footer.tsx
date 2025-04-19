import {Link, Await} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Suspense} from 'react';
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
  HeartIcon,
  CoffeeIcon,
} from './icons'; // Import new icon components

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

  return (
    <footer className="bg-[#F6F6F5] text-[#1B1F23]  ">
      <div className="container flex gap-8 md:gap-[140px] px-[40px] py-24 ">
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
          <form className="flex w-full">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="flex-grow px-[20px] border bg-white border-[#DDDDDD] rounded-l-md focus:outline-none text-black placeholder:text-black/80 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-[#1B1F23] text-white text-sm px-6 py-[13px] rounded-r-md hover:bg-gray-700"
            >
              Subscribe
            </button>
          </form>
        </div>
        {/* Store Info */}
        <div className="flex flex-col md:flex-row w-auto gap-6">
        {/* Link Columns */}
          <FooterLinkColumn
            title="About Us"
            links={[
              {title: 'Blog', url: '/blogs/news'},
              {title: 'Product Reviews', url: '/pages/reviews'},
              {title: 'Our Story', url: '/pages/about-us'},
              {title: 'Delivery', url: '/pages/delivery'},
            ]}
          />
          <FooterLinkColumn
            title="Support"
            links={[
              {title: 'Order Status', url: '/pages/order-status'},
              {title: 'Help Center', url: '/pages/help-center'},
              {title: 'Contact Us', url: '/pages/contact'},
              {title: 'Returns', url: '/policies/refund-policy'},
            ]}
          />
          <FooterLinkColumn
            title="Important Link"
            links={[
              {title: 'Maintenance', url: '/pages/maintenance'},
              {title: 'Warranty', url: '/pages/warranty'},
              {title: 'Canadian Customers', url: '/pages/canadian-customers'},
              {title: 'Setup', url: '/pages/setup'},
            ]}
          />
          <FooterLinkColumn
            title="Legal"
            links={[
              {title: 'Privacy Policy', url: '/policies/privacy-policy'},
              {
                title: 'Accessibility',
                url: '/pages/accessibility',
              },
              {title: 'Terms of Service', url: '/policies/terms-of-service'},
              {
                title: 'Affiliate Program',
                url: '/pages/affiliate-program',
              },
              {title: 'Articles', url: '/blogs/articles'},
            ]}
            />
        </div>

        {/* Contact Us */}
        <div className="text-sm flex flex-col gap-[34px]">
          <div className='flex flex-col gap-6'>
            <h3 className="text-lg font-medium text-[#1B1F23]">
              Contact Us
            </h3>
            <div className='flex flex-col gap-2'>
              <p className="text-[#1B1F23]/80 text-base">Let Us Help You</p>
              <a href="tel:8888600572" className="text-2xl font-bold text-[#1B1F23] hover:text-gray-600">
                (888) 860-0572
              </a>
            </div>
          </div>


          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-medium text-[#1B1F23] ">
              Connect With Us
            </h4>
            <div className="flex space-x-4 items-center">
              <a
                href="#"
                aria-label="Instagram"
                className="text-black hover:text-gray-900"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-black hover:text-gray-900"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-black hover:text-gray-900"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-black hover:text-gray-900"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-row justify-between px-[40px] py-3 border-t border-b border-black/10 text-center text-base text-[#1B1F23]/50">
        <p>
          © uncmfrt.com. All right reserved.
        </p>
        <Link to='https://arcticgrey.com/'>
          <p className=" text-[#1B1F23] flex flex-row items-center font-light gap-1">
            Made with <HeartIcon className="inline" /> and{' '}
            <CoffeeIcon className="inline" /> by Lorenzo from Arctic Grey
          </p>
        </Link>
      </div>
    </footer>
  );
}

// Helper component for link columns
function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: {title: string; url: string}[];
}) {
  return (
    <div className="text-sm flex flex-col gap-6">
      <h3 className="text-lg font-medium flex-shrink-0">{title}</h3>
      <ul className="gap-[14px] flex flex-col flex-grow text-[16px]">
        {links.map((link) => (
          <li key={link.title}>
            <FooterLink item={link} />
          </li>
        ))}
      </ul>
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
