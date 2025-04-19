import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
} from './icons';

// Reverted Component: Contact Us column always visible
export function FooterContactColumn() {
  return (
    <div className="text-sm w-full mt-6 md:mt-0 md:w-fit">
      {/* Title - Always visible, adjust margin */}
      <h3 className="hidden md:block text-lg font-medium text-[#1B1F23] mb-6">
        Contact Us
      </h3>

      {/* Content - Always visible, remove conditional classes, use flex-col */}
      <div
        id="contact-column-content"
        className={`flex flex-col gap-[34px]`}
      >
        <div className="flex flex-row justify-between md:flex-col md:gap-2">
          <p className="hidden md:block text-[#1B1F23]/80 text-base">Let Us Help You</p>
          <div className='flex md:hidden flex-col justify-center items-start'>
            <p className="text-[#1B1F23] text-base font-medium">Contact Us</p>
            <p className="text-[#1B1F23]/80 text-base">Let Us Help You</p>
          </div>
          <a
            href="tel:8888600572"
            className="text-lg md:text-2xl font-bold text-[#1B1F23] items-center flex hover:text-gray-600"
          >
            (888) 860-0572
          </a>
        </div>

        <div className="flex flex-row justify-between md:flex-col md:gap-6">
          <h4 className="text-base md:text-lg font-medium text-[#1B1F23] ">
            Connect With Us
          </h4>
          <div className="flex space-x-4 items-center">
            <a
              href="#"
              aria-label="Instagram"
              className="text-black hover:text-gray-900"
            >
              <InstagramIcon className='overflow-visible' />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-black hover:text-gray-900"
            >
              <TwitterIcon className='overflow-visible' />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-black hover:text-gray-900"
            >
              <FacebookIcon className='overflow-visible' />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-black hover:text-gray-900"
            >
              <YoutubeIcon className='overflow-visible' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 