
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex w-full max-sm:px-4 justify-between px-20 py-4 items-center">
     
     <div className='flex justify-center items-center gap-x-4'>
     <p className="text-lg max-sm:text-sm md:text-xl font-semibold">Token-play</p>
    
     </div>
        <p className="text-xs md:text-sm mt-2">&copy; {currentYear} Token-play. All rights reserved.</p>
    
    </footer>
  );
};

export default Footer;
