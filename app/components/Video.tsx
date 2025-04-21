import React from 'react';
import { Link } from '@remix-run/react';

export default function Video() {
  return (
    <section id='video' className='relative text-white px-4 sm:px-10 py-12 sm:py-20'>
      <div
        className='relative rounded-lg aspect-[4/3] sm:aspect-video bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center sm:items-start text-center sm:text-left w-full overflow-hidden'
        style={{ backgroundImage: "url('/images/videoBackground.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0 rounded-lg"></div>

        <div className="relative z-10 gap-6 sm:gap-10 flex flex-col items-center sm:items-start px-4 sm:px-16  w-full">
          <div className='flex flex-col gap-3 w-full'>
            <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-[50px] font-semibold leading-snug'>
              The Next Generation is Here
            </h1>
            <p className='text-base sm:text-[16px]'>
              Innovative Engineering. Intelligent Design. Meet The Plunge All-I.
            </p>
          </div>

          <div className='flex flex-row w-full sm:w-auto justify-center gap-4 text-xs md:text-[16px] '>
            <Link to='#' className='w-fit sm:w-auto'>
              <button className='bg-white w-[150px] md:w-full text-[#1B1F23] py-3 px-6 rounded-lg border border-white transition duration-300 font-medium'>
                Take The Plunge
              </button>
            </Link>
            <Link to='#' className='w-fit sm:w-auto'>
              <button className='bg-transparent w-[150px] md:w-full text-white py-3 px-6 rounded-lg border border-white hover:bg-white hover:text-[#1B1F23] transition duration-300 font-medium'>
                Dive Deeper
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
