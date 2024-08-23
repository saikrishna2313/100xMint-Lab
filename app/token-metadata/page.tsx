"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { useState } from "react"
import {Metaplex} from '@metaplex-foundation/js'
import { Cover } from "@/components/ui/cover"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

const page = () => {
    const connection=new Connection(clusterApiUrl('devnet'))
    const {toast}=useToast()
    const [mint,setMint]=useState('')
    const [image,setImage]=useState<string|undefined>("")
    const [name,setName]=useState<string|undefined>("");
    const [symbol,setSymbol]=useState<string|undefined>("")
    const [desc,setDesc]=useState<string|undefined>("")
    async function getTokenMetadata() {
      
        try {
          const metaplex = Metaplex.make(connection);
        const mintAddress = new PublicKey(mint);
    
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
        } catch (error) {
          toast({
            title: "Check Mint Address Again",
            description: "Wrong Mint Adress",
             variant:"destructive"
          })
        }
    }
  return (
    <section className="w-full max-sm:px-3 overflow-x-hidden overflow-y-hidden flex-col flex px-20 py-10 h-screen justify-center items-center">
     <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        <Cover>Read Metadata</Cover>
      </h1>
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
                <h1 className="flex justify-center items-center text-lg font-semibold text-blue-600">Name:<span className="dark:text-white text-black text-sm">{name}</span></h1>
                <h1 className="flex justify-center items-center text-lg font-semibold text-blue-600">Symbol:<span className="text-sm dark:text-white text-black">{symbol}</span></h1>
                <h1 className="flex justify-center items-center text-lg font-semibold text-blue-600">Description:<span className="text-sm dark:text-white text-black">{desc}</span></h1>
               </section>
            </section>
      }
    
    </section>
  )
}

export default page


