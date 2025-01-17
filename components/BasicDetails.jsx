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

export const signupFormSchema = z.object({
    city: z.string().nonempty({ message: "City is required" }),
    state: z
      .string()
      .nonempty({ message: "State is required" })
      .refine((val) => US_STATES.includes(val), { message: "Invalid state" }),
    profileCreatedBy: z
      .string()
      .nonempty({ message: "Profile Created By is required" }),
    adminVerificationStatus : z.string()
});

const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

const BasicDetails = ({user}) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(signupFormSchema),
    });

    const [loading,setLoading] = useState(false);

    useEffect( () => {
        if(user){
            setValue("city", user.city || "")
            setValue("state", user.state || "")
            setValue("profileCreatedBy", user.profileCreatedBy || "")
            setValue("adminVerificationStatus", user.adminVerificationStatus || "")
        }
    },[user, setValue])


    const onSubmit = async (formData) => {
        try {
            console.log(formData)
            setLoading(true);
            const response = await axios.put("/api/update-basic-details", {
                userId : user?.id,
                city : formData.city,
                state : formData.state,
                profileCreatedBy : formData.profileCreatedBy,
                adminVerificationStatus : formData.adminVerificationStatus
            })
            if(response.status === 200){
                console.log("User Updated!");
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }


  return (
    <div className='py-5' >
        <h2 className="text-xl font-bold tracking-tight">Basic Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='px-5 mt-5' >
            <div className='flex items-center justify-center gap-4' >
                <Label className="text-lg font-medium w-1/3 flex justify-end" >City:</Label>
                <Input {...register("city")} placeholder="City" className="h-[40px]" />
            </div>
            {errors.city && <p className="text-red-500 mt-2 text-sm">{errors.city.message}</p>}

            <div className="mt-4 flex items-center justify-center gap-4" >
                <Label className="text-lg font-medium w-1/3 flex justify-end" >State:</Label>
                <Select onValueChange={(value) => setValue("state", value)} value={watch("state")} >
                    <SelectTrigger className="h-[40px]" >
                        <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                        {US_STATES.map((state) => (
                            <SelectItem key={state} className="text-lgs" value={state} >{state}</SelectItem>
                        ))}
                        </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 mt-2 text-sm">{errors.state.message}</p>}
            </div>


            <div className="mt-4 flex items-center justify-center gap-4" >
            <Label className="text-lg font-medium w-1/3 flex justify-end" >Profile Created By:</Label>
                                <Select className="" onValueChange={(value) => setValue("profileCreatedBy", value)} value={watch("profileCreatedBy")} >
                                <SelectTrigger className="h-[40px]" >
                                    <SelectValue className="text-sub_text_2" placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="self">Self</SelectItem>
                                    <SelectItem value="brother">Brother</SelectItem>
                                    <SelectItem value="sister">Sister</SelectItem>
                                    <SelectItem value="guardian">Guardian</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="relative">Relative</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.profileCreatedBy && <p className="text-red-500 mt-2 text-sm">{errors.profileCreatedBy.message}</p>}
            </div>


            <div className="mt-4 flex items-center justify-center gap-4" >
            <Label className="text-lg font-medium w-1/3 flex justify-end" >Admin Verification Status:</Label>
                                <Select className="" onValueChange={(value) => setValue("adminVerificationStatus", value)} value={watch("adminVerificationStatus")} >
                                <SelectTrigger className="h-[40px]" >
                                    <SelectValue className="text-sub_text_2" placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Approve</SelectItem>
                                    <SelectItem value="false">Reject</SelectItem>
                                    
                                </SelectContent>
                            </Select>
                            {errors.adminVerificationStatus && <p className="text-red-500 mt-2 text-sm">{errors.adminVerificationStatus.message}</p>}
            </div>
            
            <div className='mt-5 flex justify-end' >
                <button className='bg-black text-white px-4 py-2 rounded-md'  type="submit"  >{loading ? "Saving" : "Save Changes"}</button>
            </div>

        </form>
    </div>
  )
}

export default BasicDetails