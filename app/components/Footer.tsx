
import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex w-full max-sm:flex max-sm:flex-col max-sm:px-4 justify-between px-20 py-4 items-center">
     
     <div className='flex justify-center items-center gap-x-4'>
     <p className="text-lg max-sm:text-sm md:text-xl font-semibold max-sm:hidden">100xMint-Lab</p>
     <Link className='flex justify-center items-center gap-x-1' href="https://x.com/the_varmax"><Twitter /> Varma</Link>
     <Link href="https://github.com/saikrishna2313/100xMint-Lab"><Github /></Link>
    
     </div>
        <p className="text-xs md:text-sm mt-2">&copy; {currentYear} 100xMint-Lab. All rights reserved.</p>
    
    </footer>
  );
};

export default Footer;
