import React from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';

const Goals = () => {
  const goals = [
    {
      id: 'sleep',
      title: 'Sleep',
      description: 'Optimize your sleep patterns.',
      imageSrc: '/images/goals/sleep.webp',
      imageMobileSrc: '/images/goals/mobile/sleep-1.webp' ,
    },
    {
      id: 'cognitive',
      title: 'Cognitive Function',
      description: 'Enhance your brain\'s performance and connectivity',
      imageSrc: '/images/goals/cognitive_function.webp',
      imageMobileSrc: '/images/goals/mobile/cognitive_function-1.webp',
    },
    {
      id: 'foundational',
      title: 'Foundational Health',
      description: 'Promoting healthy, natural deep sleep day to day',
      imageSrc: '/images/goals/foundational_health.webp',
      imageMobileSrc: '/images/goals/mobile/foundational_health-1.webp',
    },
    {
      id: 'athletic',
      title: 'Athletic Performance',
      description: 'Increase your healthy tissue, muscle, and energy',
      imageSrc: '/images/goals/athletic_performance.webp',
      imageMobileSrc:  '/images/goals/mobile/athletic_performance-1.webp',
    },
    {
      id: 'hormone',
      title: 'Hormone Support',
      description: 'Boost your mood, libido, and vitality',
      imageSrc: '/images/goals/hormone_support.webp',
      imageMobileSrc: '/images/goals/mobile/hormone_support-1.webp',
    },
  ];

  return (
    <section id='goals' className="py-16 px-4 md:px-[40px]">
      <div className="text-center mb-12">
        <p className="uppercase text-[16px] tracking-wide text-black">COMFORTABLY UNCOMFORTABLE</p>
        <h2 className="text-[28px] md:text-[40px] font-medium mt-3 text-[#1B1F23]">Start with your Goals</h2>
        <p className="mt-4 max-w-[32ch] mx-auto text-base text-[#1B1F23]/70 leading-relaxed">
          We cannot become what we want to be by
          remaining what we are.
        </p>
      </div>

      <div className="grid grid-cols-1 h-fit md:grid-cols-2 lg:grid-cols-5 gap-[20px]">
        {goals.map((goal, index) => (
          <div key={goal.id} className="flex flex-col">
            <div className="md:mb-[24px] rounded-[8px] relative overflow-hidden max-h-48 md:max-h-none">
              <Image
                src={goal.imageSrc}
                alt={goal.title}
                className="hidden md:block w-full h-full object-cover object-top"
              />
              <Image
                src={goal.imageMobileSrc}
                alt={goal.title}
                className="md:hidden w-full h-full object-cover object-top"
              />
              <div className="flex md:hidden bg-black/50 absolute px-5 inset-0 items-center text-left justify-between">
                <div className="flex-1 gap-[8px]">
                  <h3 className="text-base h-fit font-semibold text-white">{goal.title}</h3>
                  <p className="text-sm text-white">{goal.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-start">
                  <Link 
                    to={`/goals/${goal.id}`}
                    className="flex items-center justify-center rounded-full w-[36px] h-[36px] border border-white"
                    aria-label={`Learn more about ${goal.title}`}
                  >
                  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_21513_599)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M-2.81525 48.9898L-4.30539 48.9847L-4.33045 41.6568L-15.8318 53.0864L-16.8991 52.0258L-5.39918 40.5975L-12.7716 40.5712L-12.7768 39.0903L-4.33899 39.1197L-4.33999 39.1123L-2.84985 39.1174L-2.81525 48.9898Z" fill="white"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9348 21.4127L23.4447 21.4075L23.4196 14.0796L11.9183 25.5093L10.851 24.4486L22.3509 13.0204L14.9785 12.9941L14.9733 11.5132L23.4111 11.5425L23.4101 11.5351L24.9002 11.5403L24.9348 21.4127Z" fill="white"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_21513_599">
                  <rect width="19.0596" height="33.1036" fill="white" transform="matrix(0.709312 -0.704894 -0.709312 -0.704894 23.4808 37)"/>
                  </clipPath>
                  </defs>
                  </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-between">
              <div className="flex-1 gap-[8px]">
                <h3 className="text-[18px] h-fit font-semibold text-[#1B1F23]">{goal.title}</h3>
                <p className="text-[16px] text-gray-600">{goal.description}</p>
              </div>
              <div className="flex-shrink-0 flex items-start">
                <Link 
                  to={`/goals/${goal.id}`}
                  className="flex items-center justify-center rounded-full w-[36px] h-[36px] border border-[#1B1F23]"
                  aria-label={`Learn more about ${goal.title}`}
                >
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_21513_599)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M-2.81525 48.9898L-4.30539 48.9847L-4.33045 41.6568L-15.8318 53.0864L-16.8991 52.0258L-5.39918 40.5975L-12.7716 40.5712L-12.7768 39.0903L-4.33899 39.1197L-4.33999 39.1123L-2.84985 39.1174L-2.81525 48.9898Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9348 21.4127L23.4447 21.4075L23.4196 14.0796L11.9183 25.5093L10.851 24.4486L22.3509 13.0204L14.9785 12.9941L14.9733 11.5132L23.4111 11.5425L23.4101 11.5351L24.9002 11.5403L24.9348 21.4127Z" fill="#1B1F23"/>
                </g>
                <defs>
                <clipPath id="clip0_21513_599">
                <rect width="19.0596" height="33.1036" fill="white" transform="matrix(0.709312 -0.704894 -0.709312 -0.704894 23.4808 37)"/>
                </clipPath>
                </defs>
                </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Goals;
