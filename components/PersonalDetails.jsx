"use client"

import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import axios from 'axios'

const heights = [
    "Below 4ft",
    "4ft",
    "4ft 1in",
    "4ft 2in",
    "4ft 3in",
    "4ft 4in",
    "4ft 5in",
    "4ft 6in",
    "4ft 7in",
    "4ft 8in",
    "4ft 9in",
    "4ft 10in",
    "4ft 11in",
    "5ft",
    "5ft 1in",
    "5ft 2in",
    "5ft 3in",
    "5ft 4in",
    "5ft 5in",
    "5ft 6in",
    "5ft 7in",
    "5ft 8in",
    "5ft 9in",
    "5ft 10in",
    "5ft 11in",
    "6ft",
    "6ft 1in",
    "6ft 2in",
    "6ft 3in",
    "Above 6ft 3in"
  ];
  
  const personalDetailsScehma = z.object({
      aboutMe: z.string().nonempty({ message: "About Me is required" }).refine((value) => {
          // Banned words
          const bannedWords = ["aol", "gmail", "yahoo", "live", "msn", "fb", "instagram", "tiktok"];
          const containsBannedWords = bannedWords.some((word) => value.toLowerCase().includes(word));
      
          // Check for numbers, @, or banned words
          const containsNumbersOrSpecialChars = /[0-9@]/.test(value);
      
          return !containsBannedWords && !containsNumbersOrSpecialChars;
      }, {
          message: "About Me must not include numbers, email addresses, '@', or banned words like AOL, Gmail, etc.",
      }),
      height : z.string().nonempty({ message: "Height is required" }),
      maritalStatus : z.string().nonempty({ message: "Marital Status is required" }),
      children : z.string().nonempty({ message: "No of Children is required" }),
      childrenLiving : z.string().optional(),
      moreKids : z.string().nonempty({ message: "Want More Kids is required" }),
      ethnicBackground : z.string().nonempty({ message: "Ethnic Background is required" }),
      occupation : z.string().nonempty({ message: "Occupation is required" }).refine((value) => /^[A-Za-z\s]+$/.test(value), {
          message: "Occupation must only contain letters and spaces",
        }),
      hobbies : z.string().nonempty({ message: "Hobbies is required" }),
      education : z.string().nonempty({message : "Education is required"})
  })

const PersonalDetails = ({personalDetails , userId}) => {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(personalDetailsScehma),
    });

    const [loading,setLoading] = useState(false);

     useEffect( () => {
            if(personalDetails){
                setValue("aboutMe", personalDetails.aboutMe || "");
                setValue("height", personalDetails.height || "");
                setValue("maritalStatus", personalDetails.maritalStatus || "");
                setValue("children", personalDetails.children || "");
                setValue("childrenLiving", personalDetails.childrenLiving || "");
                setValue("moreKids", personalDetails.moreKids || "");
                setValue("ethnicBackground", personalDetails.ethnicBackground || "");
                setValue("education", personalDetails.education || "");
                setValue("occupation", personalDetails.occupation || "");
                setValue("hobbies", personalDetails.hobbies || "");
            }
        },[personalDetails, setValue])
    
    
    const onSubmit = async (data) => {
        try {
            console.log(data);
            setLoading(true);
            const response = await axios.put('/api/update-personal-details',{
                aboutMe : data.aboutMe,
                height : data.height,
                maritalStatus : data.maritalStatus,
                children : data.children,
                childrenLiving : data.childrenLiving || "",
                moreKids : data.moreKids,
                ethnicBackground : data.ethnicBackground,
                occupation : data.occupation,
                hobbies : data.hobbies,
                education : data.education,
                userId : userId
            })
            if(response.status === 200){
                console.log("User Personal Details Updated!")
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }


  return (
    <div className='py-5' >
        <h2 className="text-xl font-bold tracking-tight">Personal Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='px-5 mt-5' >
            <div className='flex items-center justify-center gap-4' >
                <Label className="text-lg font-medium w-1/3 flex justify-end" >About (No Contact Details Allowed):</Label>
                <textarea className='h-[82px] w-2/3 rounded-md border border-light_gray p-2 mt-2'  {...register("aboutMe")}  />
                {errors.aboutMe && <p className="text-red-500 mt-2 text-sm">{errors.aboutMe.message}</p>}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4" >
            <Label className="text-lg font-medium w-1/3 flex justify-end" >Height:</Label>
                        <Select onValueChange={(value) => setValue("height", value)} value={watch("height")} >
                            <SelectTrigger className="h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {heights.map((height) => (
                                    <SelectItem key={height} value={height} >{height}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.height && <p className="text-red-500 mt-2 text-sm">{errors.height.message}</p>}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4" >
                    <Label className="text-lg font-medium w-1/3 flex justify-end" >Marital Status:</Label>
                        <Select onValueChange={(value) => setValue("maritalStatus", value)} value={watch("maritalStatus")} >
                            <SelectTrigger className='h-[40px]' >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Never Married" >Never Married</SelectItem>
                                <SelectItem value="Divorced" >Divorced</SelectItem>
                                <SelectItem value="Widowed" >Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.maritalStatus && <p className="text-red-500 mt-2 text-sm">{errors.maritalStatus.message}</p>}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center gap-4" >
                    <Label className="text-lg font-medium w-1/3 flex justify-end" >Children:</Label>
                        <Select onValueChange={(value) => setValue("children", value)} value={watch("children")} >
                            <SelectTrigger className='h-[40px]' >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None" >None</SelectItem>
                                <SelectItem value="1" >1</SelectItem>
                                <SelectItem value="2" >2</SelectItem>
                                <SelectItem value="3" >3</SelectItem>
                                <SelectItem value="4" >4 or above</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.children && <p className="text-red-500 mt-2 text-sm">{errors.children.message}</p>}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4" >
                    <Label className="text-lg font-medium w-1/3 flex justify-end" >Children Living Status:</Label>
                        <Select onValueChange={(value) => setValue("childrenLiving", value)} value={watch("childrenLiving")} >
                            <SelectTrigger className='h-[40px]' >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A" >N/A</SelectItem>
                                <SelectItem value="Living With Me" >Living with me</SelectItem>
                                <SelectItem value="Not Living With Me" >Not Living with me</SelectItem>
                                <SelectItem value="Shared Custody" >Shared Custody</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.childrenLiving && <p className="text-red-500 mt-2 text-sm">{errors.childrenLiving.message}</p>}
                    </div>


                    <div className="mt-4 flex items-center justify-center gap-4" >
                    <Label className="text-lg font-medium w-1/3 flex justify-end" >Want More Kids:</Label>
                        <Select onValueChange={(value) => setValue("moreKids", value)} value={watch("moreKids")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes" >Yes</SelectItem>
                                <SelectItem value="no" >No</SelectItem>
                                <SelectItem value="maybe" >Maybe</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.moreKids && <p className="text-red-500 mt-2 text-sm">{errors.moreKids.message}</p>}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4" >
                    <Label className="text-lg font-medium w-1/3 flex justify-end" >Ethnic Background:</Label>
                        <Select onValueChange={(value) => setValue("ethnicBackground", value)} value={watch("ethnicBackground")} >
                            <SelectTrigger className='h-[40px]' >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="African" >African</SelectItem>
                                <SelectItem value="African American" >African American</SelectItem>
                                <SelectItem value="Desi / South-Asian" >Desi / South Asian</SelectItem>
                                <SelectItem value="Arab / Middle-Eastren" >Arab / Middle Eastren</SelectItem>
                                <SelectItem value="Caribbean" >Caribbean</SelectItem>
                                <SelectItem value="East-Asian" >East Asian</SelectItem>
                                <SelectItem value="Latino / Hispanic" >Latino / Hispanic</SelectItem>
                                <SelectItem value="White / Caucasian" >White / Caucasian</SelectItem>
                                <SelectItem value="Mixed" >Mixed</SelectItem>
                                <SelectItem value="Other" >Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.ethnicBackground && <p className="text-red-500 mt-2 text-sm">{errors.ethnicBackground.message}</p>}
                    </div>


                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end">Education: </Label>
                        <Select onValueChange={(value) => setValue("education", value)} value={watch("education")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High School Diploma" >High School Diploma</SelectItem>
                                <SelectItem value="College / University" >College / University</SelectItem>
                                <SelectItem value="Career Institute" >Career Institute</SelectItem>
                                <SelectItem value="Masters Degree" >Masters Degree</SelectItem>
                                <SelectItem value="Skilled Trade" >Skilled Trade</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.education && <p className="text-red-500 mt-2 text-sm">{errors.education.message}</p>}
                    </div>


                    <div className='mt-4 flex items-center justify-center gap-4' >
                    <Label className="text-lg font-medium w-1/3 flex justify-end">Occupation: </Label>
                        
                            
                            <Input {...register("occupation")} placeholder="" className="w-full"  />
                        
                        
                    </div>
                    {errors.occupation && <p className="text-red-500 text-sm mt-2" >{errors.occupation.message}</p>}

                    <div className='mt-4 flex items-center justify-center gap-4' >
                    <Label className="text-lg font-medium w-1/3 flex justify-end">Hobbies: </Label>
                    <Input {...register("hobbies")} placeholder="" className="w-full"  />
                        
                    </div>
                    {errors.hobbies && <p className="text-red-500 text-sm mt-2" >{errors.hobbies.message}</p>}

<div className='mt-5 flex justify-end' >
                <Button type="submit"  >{loading ? 'Saving' : "Save Changes"}</Button>
            </div>


        </form>
    </div>
  )
}

export default PersonalDetails