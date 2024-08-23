"use client";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { createMintToInstruction, getAssociatedTokenAddress, getMint, getMintCloseAuthority, getTokenMetadata } from "@solana/spl-token";
import { use, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { Cover } from "@/components/ui/cover";

const page = () => {
  const [mint, setMint] = useState("");
  const { publicKey, sendTransaction } = useWallet();
  const [tokenAccountAddress, setTokenAccoutAdress] = useState("");
  const [noOfToken, setNofTokens] = useState("");
  const connection = new Connection(clusterApiUrl("devnet"));
  const {toast}=useToast();
  const getTokenAccount=async()=>{
   
   try {
    if(publicKey){
      const tokenAd=(await getAssociatedTokenAddress(new PublicKey(mint),publicKey)).toBase58()
    if(!tokenAd){
      toast({
        title: "No token Account Found",
        description: "Check Mint Address Again",
         variant:"destructive"
      })
      return;
  
    }
    setTokenAccoutAdress(tokenAd);
    }
   } catch (error) {
    toast({
      title: "No token Account Found",
      description: "There is no token account found with this MINT and Your Public Key",
       variant:"destructive"
    })
 
   }
    
  }
 
  const mintTokens = async () => {
        
    if(!publicKey||!noOfToken||!mint){
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There are some missing Fields Check Again.",
         variant:"destructive"
      })
      return
    }
  const MINT=await getMint(connection,new PublicKey(mint))
  if(!MINT){
    toast({
      title: "Check Mint Address Again",
      description: "Wrong Mint Adress",
       variant:"destructive"
    })
    return;
  }


   if(MINT.mintAuthority?.toBase58()!==publicKey.toBase58()){
    toast({
      title: "Sorry..!",
      description: "Your are not the Mint Author",
       variant:"destructive"
    })
    return;
   }

   if(parseInt(noOfToken)>100||parseInt(noOfToken)<1){
    toast({
      title: "Wrong token Count",
      description: "Check the Token Count",
       variant:"destructive"
    })
    return
   }
const TOKEN_DECIMALS=MINT?.decimals
    if (publicKey) {
      const transaction = new Transaction().add(
        createMintToInstruction(
          new PublicKey(mint),
          new PublicKey(tokenAccountAddress),
          publicKey,
          parseInt(noOfToken) * 10 ** TOKEN_DECIMALS
        )
      );
     
      const signx = await sendTransaction(transaction, connection);
      toast({
        title: `You have minted ${noOfToken} now`,
        description: <Link  className="text-blue-500 font-semibold" href={`https://explorer.solana.com/tx/${signx}?cluster=devnet`}>Check Here</Link>,
         className:"bg-green-500 text-white"
      })
    }
  };
  return (
    <section className="h-screen max-sm:px-3 flex-col px-20 w-full flex justify-center items-center">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        <Cover>Mint More Tokens</Cover>
      </h1>
     {
      publicKey? <form 
      onSubmit={(e)=>{
        e.preventDefault();
        mintTokens()
      }}
      className="flex w-[60%] max-sm:w-full flex-col items-center justify-center gap-y-4"
    >
      <Input
        placeholder="Enter Mint Address "
        className="w-full"
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        type="text"
      />
      <Button type="button" onClick={()=>getTokenAccount()} className="w-full">
       GetTokenAccount
      </Button>

      {
         tokenAccountAddress&&
         <h1 className="w-[100%] flex justify-start items-center  text-sm">Your Token Acccount: {tokenAccountAddress}</h1>
      }
      <Input
        className="w-full"
        placeholder="Enter no.of Tokens "
        value={noOfToken}
        onChange={(e) => setNofTokens(e.target.value)}
        type="text"
      />
      <Button className="w-full" type="submit">
        Mint Tokens
      </Button>
    </form>:<section>
        <Image className="w-[350px] my-3 rounded-xl shadow-xl" unoptimized={true} quality={100} alt="wallet" src={"https://moralis.io/wp-content/uploads/2023/01/Illustrative-Solana-Wallet-Image-1024x475.png"} width={150} height={150}/>
        <WalletMultiButton/>
        </section>
     }
     

    </section>
  );
};

export default page;
