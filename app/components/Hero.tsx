import {Link} from '@remix-run/react';

interface HeroProps {
  title?: string;
  ctaText?: string;
  ctaLink?: string;
  videoSource?: string;
  scrollingItems?: ScrollingItem[];
}

interface ScrollingItem {
  text: string;
  icon?: 'star' | 'none';
}

const defaultScrollingItems: ScrollingItem[] = [
  { text: 'High Quality Ingredients', icon: 'star' },
  { text: 'Independently Certified', icon: 'star' },
  { text: 'Expert Driven', icon: 'star' },
  { text: 'Shipped Internationally', icon: 'star' },
];

const StarIcon = () => (
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.80609 0.267367C7.85697 0.0660302 8.14303 0.0660302 8.1939 0.267367L9.26722 4.51494C9.29776 4.63579 9.43019 4.69956 9.54372 4.64809L13.5338 2.83893C13.7229 2.75317 13.9013 2.97682 13.7756 3.14213L11.1239 6.6296C11.0485 6.72882 11.0812 6.87213 11.1922 6.92879L15.0944 8.92037C15.2794 9.01477 15.2158 9.29366 15.0081 9.29846L10.6282 9.39969C10.5036 9.40257 10.412 9.51749 10.4369 9.63962L11.3128 13.9322C11.3543 14.1357 11.0966 14.2598 10.9634 14.1005L8.15344 10.7393C8.0735 10.6436 7.9265 10.6436 7.84656 10.7393L5.03658 14.1005C4.90339 14.2598 4.64566 14.1357 4.68718 13.9322L5.5631 9.63962C5.58802 9.51749 5.49638 9.40257 5.37176 9.39969L0.991852 9.29846C0.784242 9.29366 0.720588 9.01477 0.905556 8.92037L4.8078 6.92879C4.91882 6.87213 4.95153 6.72882 4.87609 6.6296L2.2244 3.14213C2.09871 2.97682 2.27707 2.75317 2.4662 2.83893L6.45628 4.64809C6.56981 4.69956 6.70224 4.63579 6.73278 4.51494L7.80609 0.267367Z" fill="white"/>
  </svg>
);

const ScrollingText = ({ items }: { items: ScrollingItem[] }) => {
  // Duplicamos los items 4 veces para asegurar que siempre haya contenido visible
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="absolute bottom-0 left-0 right-0 py-4 bg-black bg-opacity-50 overflow-hidden whitespace-nowrap">
      <div className="inline-flex items-center gap-4 animate-scroll">
        {duplicatedItems.map((item, index) => (
          <div key={`${item.text}-${index}`} className="flex items-center gap-4">
            <span className="text-white font-semibold tracking-wider text-xs md:text-sm">
              {item.text}
            </span>
            <StarIcon />
          </div>
        ))}
      </div>
      {/* Duplicamos el contenido para crear una transición suave */}
      <div className="inline-flex items-center gap-4 animate-scroll" aria-hidden={true}>
        {duplicatedItems.map((item, index) => (
          <div key={`${item.text}-second-${index}`} className="flex items-center gap-4">
            <span className="text-white font-semibold tracking-wider text-sm">
              {item.text}
            </span>
            <StarIcon />
          </div>
        ))}
      </div>
    </div>
  );
};

export function Hero({
  title = "Great things never came from comfort zones.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
  videoSource = "/videos/hero_video.mp4",
  scrollingItems = defaultScrollingItems,
}: HeroProps) {
  return (
    <div id='Hero' className="relative h-[75vh] md:min-h-screen bg-gray-900 px-10">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* Hero Content */}
      <div className="relative flex items-center justify-start h-screen">
        <div className="md:max-w-[60%] absolute  md:bottom-40 left-0">
          <span className="text-white text-2xl md:text-9xl lg:text-[70px] font-bold max-w-3xl leading-tight tracking-tight">
            {title}
          </span>
          <div className="mt-8">
            <Link
              to={ctaLink}
              className="inline-block bg-white text-black text-sm md:text-base font-semibold px-6 py-2 md:px-8 md:py-3 rounded-[8px] hover:bg-gray-100 transition-colors tracking-wide"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      <ScrollingText items={scrollingItems} />
    </div>
  );
} 

