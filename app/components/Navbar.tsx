"use client"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import React, { useState } from 'react'
import { ModeToggle } from './ThemeToggle'
import Link from 'next/link'
import logo from '../../public/logo.png'
import drop from '../../public/drop.png'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [rot,setRot]=useState(false);
  return (
   <nav className='w-full    py-5 px-20 max-sm:px-2 flex justify-between items-center border-b-2'>
  <Link href={"/"} className='flex justify-center items-center gap-x-2'> <Image src={logo}  className='w-16 max-sm:w-12'  alt='logo' /> <h1 className='text-xl font-semibold max-sm:text-lg'>100xMint-Lab</h1></Link>
  
  <div className='space-x-3 justify-center items-center flex'>
  <div>
  <DropdownMenu>
 <DropdownMenuTrigger>
 <Image  unoptimized={true} className='w-14 max-sm:w-8 max-sm:h-8 h-14 rounded-full border-2' src={drop} alt="trigger" height={15} width={15}/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Navigate</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <WalletMultiButton className='max-sm:px-3 max-sm:py-2 max-sm:text-sm'/>
    <DropdownMenuItem>

      <Link href="/create-token">Create Token👛</Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
    <Link href="/mint-tokens">Mint Tokens💡</Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
    <Link href="/burn-tokens">Burn Tokens🔥</Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
    <Link href="/token-metadata">Metadata🔤</Link>
    </DropdownMenuItem>
    
    
    
    <DropdownMenuItem className='sm:hidden'>
    <ModeToggle/>
    </DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu>
  </div>
  <div className='max-sm:hidden flex justify-center items-center gap-x-3'>
  <WalletMultiButton className='max-sm:px-3 max-sm:hidden sm: max-sm:py-2 max-sm:text-sm'/>
  <ModeToggle />
  </div>
  </div>
   </nav>
  )   
}

export default Navbar