"use client"

import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID, } from "@metaplex-foundation/mpl-token-metadata";
import { createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAccountLenForMint, getAssociatedTokenAddress, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, getMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { ShipWheelIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


const page = () => {

  const [tokenLoading,setTOkenLoading]=useState(false)
  const[tokenMintAdress,setTokenMintAdress]=useState("")
  const {publicKey,sendTransaction}=useWallet();
  const {toast}=useToast();

  const connection=new Connection(clusterApiUrl("devnet"))
  const [token,setToken]=useState({
    name:"",
    symbol:"",
    decimals:"",
    amount:"",
    image:"",
    description:"",
  })

  const createToken=async()=>{
    setTOkenLoading(true)
    if(!publicKey||!token.name||!token.symbol||!token.description||!token.decimals||!token.amount||!token.image){
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There are some missing Fields Check Again.",
         variant:"destructive"
      })
      setTOkenLoading(false)
      return
    }

    if(parseInt(token.decimals)<=0 ||parseInt(token?.decimals)>12){
      toast({
        title: "Add correct Decimals",
        description: "Make Sure the Decimals should be 1-12",
         variant:"destructive"
      })
      setTOkenLoading(false)
      return
    }
    if(parseInt(token.amount)<=0 ||parseInt(token?.amount)>100){
      toast({
        title: "Amount not Acceptable",
        description: "Make Sure the Amount should be 1-00",
         variant:"destructive"
      })
      setTOkenLoading(false)
      return
    }
    if(publicKey){
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const accountKeypair = Keypair.generate();
    const tokenATA=await getAssociatedTokenAddress(
      accountKeypair?.publicKey,
      publicKey
    )

 try {
const metaDataUrl=await uploadMetaData(token);
 const createMetaDataInstruction=createCreateMetadataAccountV3Instruction({
  metadata:PublicKey.findProgramAddressSync([
    Buffer.from("metadata"),
    PROGRAM_ID.toBuffer(),
    accountKeypair?.publicKey.toBuffer(),

  ],
PROGRAM_ID
)[0],
mint:accountKeypair.publicKey,
mintAuthority:publicKey,
payer:publicKey,
updateAuthority:publicKey,

 },
 {
  createMetadataAccountArgsV3:{
    data:{
      name:token?.name,
      symbol:token?.symbol,
      uri:metaDataUrl?metaDataUrl:"",
      creators:null,
      sellerFeeBasisPoints:0,
      uses:null,
      collection:null,


    },
    isMutable:false,
    collectionDetails:null
  }
 }

)

const createTokenTransaction=new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey:publicKey,
    newAccountPubkey:accountKeypair.publicKey,
    space:MINT_SIZE,
    lamports:lamports,
    programId:TOKEN_PROGRAM_ID
  }),
  createInitializeMintInstruction(
    accountKeypair.publicKey,
    Number(parseInt(token.decimals)),
    publicKey,
    publicKey,
    TOKEN_PROGRAM_ID
  ),
  createAssociatedTokenAccountInstruction(
    publicKey,
    tokenATA,publicKey,
    accountKeypair.publicKey

  ),
  createMintToInstruction(
    accountKeypair.publicKey,
    tokenATA,
    publicKey,
    Number(token.amount)*Math.pow(10,parseInt(token.decimals))
  ),
  createMetaDataInstruction

)
const sign=await sendTransaction(createTokenTransaction,connection,{
  signers:[accountKeypair]
}
)

setTokenMintAdress(accountKeypair?.publicKey.toBase58())

setTOkenLoading(false)
 } catch (error) {
  console.log(error)
 }

    }
  }

  const UploadImagePinata=async(file:File)=>{
    
    if(file){
      try {
        const formData=new FormData()
        formData.append("file",file);
        const response=await axios({
          method:"POST",
          url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
          data:formData,
          headers:{
            pinata_api_key:process.env.NEXT_PUBLIC_PINATA_API,
            pinata_secret_api_key:process.env.NEXT_PUBLIC_PINATA_SECRET,
            "Content-Type":"multipart/form-data"
          }
    
        })
        const imgHash=`https://gateway.pinata.cloud/ipfs/${response?.data?.IpfsHash}`
        return imgHash
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Image is not getting Uploaded try again..!",
           variant:"destructive"
        })
        return
      }
    }
     }

const[loading,setLoading]=useState(false)
     
 const handleImage=async(e:any)=>{
  setLoading(true)
  const file=e.target.files[0];
  if(file){
 
   const imgUrl=await UploadImagePinata(file);

   setToken({...token,image:imgUrl||''})
   setLoading(false)
  }
  
  
   }

   const uploadMetaData=async(token:any)=>{
  

    const {name,symbol,description,image}=token;
    if(!name||!symbol||!description||!image){
      return console.log("Dats is not Suffiecient")
    }
    const data=JSON.stringify({
      name,symbol,description,image
    })

    try {
     
      const response=await axios({
        method:"POST",
        url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data:data,
        headers:{
            pinata_api_key:process.env.NEXT_PUBLIC_PINATA_API,
            pinata_secret_api_key:process.env.NEXT_PUBLIC_PINATA_SECRET,
          "Content-Type":"application/json"
        }
  
      })
      const url=`https://gateway.pinata.cloud/ipfs/${response?.data?.IpfsHash}`
      
      return url;
    } catch (error:any) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Upload Image Error",
         variant:"destructive"
      })
      return
    }
    
   }
  return (
    <section className="flex max-sm:px-3 min-h-screen justify-center items-center flex-col gap-y-3 px-20 py-5">
<h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        <Cover>Create Your Token</Cover>
      </h1>
      {
        !publicKey?<section>
        <Image className="w-[350px] my-3 rounded-xl shadow-xl" unoptimized={true} quality={100} alt="wallet" src={"https://moralis.io/wp-content/uploads/2023/01/Illustrative-Solana-Wallet-Image-1024x475.png"} width={150} height={150}/>
        <WalletMultiButton/>
        </section>:<>
        <Input placeholder="Enter Token Name" value={token.name} onChange={(e)=>{
      setToken({...token,name:e.target.value})
     }} type="text"/>
     <Input placeholder="Enter Token Symbol" value={token.symbol} onChange={(e)=>{
      setToken({...token,symbol:e.target.value})
     }} type="text"/>
     <Input placeholder="Enter Description " value={token.description} onChange={(e)=>{
      setToken({...token,description:e.target.value})
     }} type="text"/>
     <Input placeholder="Enter Decimals " value={token.decimals} onChange={(e)=>{
      setToken({...token,decimals:e.target.value})
     }}type="text"/>
     <Input placeholder="Enter Amount" value={token.amount} onChange={(e)=>{
      setToken({...token,amount:e.target.value})
     }} type="text"/>
     
    {
      !token?.image?<section>
        {
          !loading?<label htmlFor="file" className="cursor-pointer">
    
          <Image className="w-[150px]" unoptimized={true} src={"https://cdn-icons-png.freepik.com/512/5173/5173034.png"} alt="p" width={30} height={30}/>
          <p className="text-sm font-bold uppercase text-violet-600">Upload Token Icon</p>
          <input hidden  type="file" id="file" onChange={handleImage}/>
    
         </label>:
         <div>
          <ShipWheelIcon className="w-28 h-28 animate-spin"/>
         </div>
        }
      </section>:
      <section>
        <Image src={token?.image} alt="token" width={300} height={200} className="w-[300px] rounded-md" unoptimized={true}/>
      </section>
    }
     
     <Button  onClick={()=>createToken()}>Create Token</Button>
     {
      <div>
        {
          tokenLoading?<div>
          <ShipWheelIcon className="w-28 h-28 animate-spin"/>
         </div>:tokenMintAdress&&<Link  className="text-blue-500 font-semibold" href={`https://explorer.solana.com/address/${tokenMintAdress}?cluster=devnet`}>Check Here</Link>
        }
      </div>
      
     }

     </>
      }
     

    </section>
  )
}

export default page