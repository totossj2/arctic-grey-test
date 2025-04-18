import React from 'react';
import { Link } from '@remix-run/react';

export default function Video() {
  return (
    <section id='video' className='relative text-white px-10 py-20 '>
      <div
        className='relative rounded-lg aspect-video bg-no-repeat bg-cover bg-center flex  justify-start items-center text-center w-full overflow-hidden'
        style={{ backgroundImage: "url('/images/videoBackground.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0 rounded-lg"></div>

        <div className="relative z-10 gap-10 flex flex-col px-15">
            <div className='text-left flex flex-col gap-2'>
                <h1 className='text-4xl md:text-5xl lg:text-[50px] font-semibold'>
                    The Next Generation is Here
                </h1>
                <p className='text-[16px] '>
                    Innovative Engineering. Intelligent Design. Meet The Plunge All-I.
                </p>
            </div>
            <div className='flex flex-col sm:flex-row justify-start font-medium gap-3'>
                <Link to='#'>
                    <button className='bg-white w-[190px] text-[#1B1F23] py-3 px-6 rounded-lg  border border-white  transition duration-300'>
                        Take The Plunge
                    </button>
                </Link>
                <Link to='#'>
                    <button className='bg-transparent w-[190px] border border-white text-white  py-3 px-6 rounded-lg hover:bg-white hover:text-[#1B1F23] transition duration-300'>
                        Dive Deeper
                    </button>
                </Link>

            </div>
        </div>
      </div>
    </section>
  );
}