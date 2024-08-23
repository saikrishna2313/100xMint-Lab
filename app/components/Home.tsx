"use client"

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { Button } from "@/components/ui/button"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { Spotlight } from "@/components/ui/spotlight"

import { useToast } from "@/components/ui/use-toast"
import { Vortex } from "@/components/ui/vortex"

import { useWallet } from "@solana/wallet-adapter-react"

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"



const Home = () => {
    const {publicKey,sendTransaction}=useWallet();
    const [solBalance,setSolBalance]=useState<number>();
    const connection=new Connection(clusterApiUrl("devnet"));
    const [mintSign,setmintSign]=useState("");
    const {toast}=useToast();
    const [loading,setLoading]=useState(false)
    useEffect(() => {

        if (publicKey) {
         
          (async function getBalanceEvery10Seconds() {
            
            const newBalance = await connection.getBalance(publicKey);
            setSolBalance(newBalance / LAMPORTS_PER_SOL);
            setTimeout(getBalanceEvery10Seconds, 10000);
          })();
        }
      }, [publicKey, connection, solBalance]);
      
 const AirDrop=async()=>{
  if(!publicKey){
    toast({
      title: "Connect the Wallet😀",
       variant:"destructive"
    })

  }


    if(publicKey){
     
     try {
      const airdrop=await connection.requestAirdrop(publicKey,1*LAMPORTS_PER_SOL);
      toast({
        title: "Airdrop Successful",
        description:<Link  className="text-blue-500 font-semibold" href={`https://explorer.solana.com/tx/${airdrop}?cluster=devnet`}>Check Here</Link>,
      })
     
     } catch (error) {
      toast({
        title: "Your Limit Exceeded",
        description:"Try Again Later😊"
      })
     }
    }
  
 }

   return (
    <BackgroundBeamsWithCollision>
      <div className="w-full bg-slate-200 text-black dark:bg-[hsl(222.2,84%,4.9%)]  mx-auto rounded-md  h-screen overflow-hidden">
  
      <div
        
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-black dark:text-white text-xl md:text-4xl font-bold text-center">
        100xMint-Lab
        </h2>
        <p className="text-black  dark:text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
        Unleash the power of Solana with 100xMint-Lab where creating and managing tokens is a breeze! 🌟

        </p>
  
        <div className="flex flex-col sm:flex-row max-sm:grid max-sm:grid-cols-2 items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
           <Link href={"/create-token"}> Build Token</Link>
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            <Link href={"/mint-tokens"}>Mint Token</Link>
          </button>
          <button className="px-4 py-2 bg-pink-600 hover:bg-green-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            <Link href={"/burn-tokens"}>Burn Token</Link>
          </button>
          <button className="px-4 py-2 bg-yellow-600 hover:bg-green-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            <Link href={"/token-metadat"}>Metadata</Link>
          </button>
        </div>
        <Button className="bg-gradient-to-r my-4 text-white from-pink-500 via-purple-700 to-green-400" onClick={AirDrop}>AirDrop SOL</Button>
      </div>
    </div>
  
    </BackgroundBeamsWithCollision>

  )
}

export default Home