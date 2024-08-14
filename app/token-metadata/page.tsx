"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { useState } from "react"
import {Metaplex, token} from '@metaplex-foundation/js'

import Image from "next/image"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

const page = () => {
    const connection=new Connection(clusterApiUrl('devnet'))
    const {publicKey}=useWallet()
    const [mint,setMint]=useState('')
    const [image,setImage]=useState<string|undefined>("")
    const [name,setName]=useState<string|undefined>("");
    const [symbol,setSymbol]=useState<string|undefined>("")
    const [desc,setDesc]=useState<string|undefined>("")
    async function getTokenMetadata() {

        const metaplex = Metaplex.make(connection);
    
        const mintAddress = new PublicKey(mint);
    
        let tokenName;
        let tokenSymbol;
        let tokenLogo;
    
        const metadataAccount = metaplex
            .nfts()
            .pdas()
            .metadata({ mint: mintAddress });
    
        const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
    
        if (metadataAccountInfo) {
              const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
           
            setName(token?.json?.name);
            setImage(token?.json?.image);
            setDesc(token?.json?.description);
            setSymbol(token?.json?.symbol);
            

        }
    }
  return (
    <section className="w-full max-sm:px-3 overflow-x-hidden overflow-y-hidden flex-col flex px-20 py-10 h-screen justify-center items-center">
      <Image alt="burn" className="w-[300px] my-5 animate-pulse rounded-md shadow-xl" src={'https://wallpapercave.com/wp/wp9800950.jpg'} width={300} height={300} />
      {
        !name?  <form className="w-[60%] max-sm:w-full flex flex-col justify-center items-center gap-y-4" onSubmit={(e)=>{
            e.preventDefault();
            getTokenMetadata();
        }}>
        <Input  className="w-full" type="text" onChange={(e)=>setMint(e.target?.value)} placeholder="Enter Mint Address" />
        <Button type="submit" className="w-full">Get Metadata</Button>
        </form>:
 
            
            <section className="flex justify-center gap-y-5 flex-col flex-center items-center h-full">
            {
                image&& <Image unoptimized={true} className="w-[200px] rounded-md shadow-xl" src={image} alt="tokenImage" width={300} height={300}/>
               }
               <section className="flex justify-center items-start gap-4 flex-col">
                <h1 className="flex justify-center items-center text-lg font-semibold text-green-600">Name:<span className="dark:text-white text-black text-sm">{name}</span></h1>
                <h1 className="flex justify-center items-center text-lg font-semibold text-green-600">Symbol:<span className="text-sm dark:text-white text-black">{symbol}</span></h1>
                <h1 className="flex justify-center items-center text-lg font-semibold text-green-600">Description:<span className="text-sm dark:text-white text-black">{desc}</span></h1>
               </section>
            </section>
      }
    
    </section>
  )
}

export default page


