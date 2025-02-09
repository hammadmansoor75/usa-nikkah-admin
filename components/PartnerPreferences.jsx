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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

const ageRange = [
    "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
    "28", "29", "30", "31", "32", "33", "34", "35", "36", "37",
    "38", "39", "40", "41", "42", "43", "44", "45", "46", "47",
    "48", "49", "50", "51", "52", "53", "54", "55", "56", "57",
    "58", "59", "60", "61", "62", "63", "64", "65", "66", "67",
    "68", "69", "70"
]

const US_STATES = [
    "ANY","Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];
  

const generatePartnerSchema = (gender) => {
    const commonPartnerPreferenceSchema = z
      .object({
        ageGroupFrom: z.string().nonempty({ message: "This field is required" }),
        ageGroupTo: z.string().nonempty({ message: "This field is required" }),
        state: z.string().nonempty({ message: "This field is required" }),
        maritalStatus: z.string().nonempty({ message: "This field is required" }),
        relegiousPrefrence: z.string().nonempty({ message: "This field is required" }),
        ethnicityPrefrence: z.string().nonempty({ message: "This field is required" }),
        educationLevel: z.string().nonempty({ message: "This field is required" }),
        work: z.string().nonempty({ message: "This field is required" }),
        considerSomeoneHavingChildren: z.string().nonempty({ message: "This field is required" }),
      })
  
    const malePartnerSchema = z.object({
      hijab: z.enum(["Yes", "No", "Dont Matter"], { message: "This field is required" }),
    });
  
    const femalePartnerSchema = z.object({
      smoke: z.enum(["Yes", "No", "Dont Matter"], { message: "This field is required" }),
    });
  
    return gender === "male"
      ? commonPartnerPreferenceSchema.merge(malePartnerSchema)
      : commonPartnerPreferenceSchema.merge(femalePartnerSchema);
  };
  
  

const PartnerPreferences = ({partnerPreferences, gender, userId}) => {

    const schema = generatePartnerSchema(gender);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if(partnerPreferences){
            setValue("ageGroupFrom", partnerPreferences?.ageGroupFrom || "");
            setValue("ageGroupTo", partnerPreferences?.ageGroupTo || "");
            setValue("state", partnerPreferences?.state || "");
            setValue("maritalStatus", partnerPreferences?.maritalStatus || "");
            setValue("relegiousPrefrence", partnerPreferences?.religiousPreference || "");
            setValue("ethnicityPrefrence", partnerPreferences?.ethnicityPreference || "");
            setValue("educationLevel", partnerPreferences?.educationLevel || "");
            setValue("work", partnerPreferences?.work || "");
            setValue("considerSomeoneHavingChildren", partnerPreferences?.considerSomeoneHavingChildren || "");
            setValue("hijab", partnerPreferences?.hijab || "");
            setValue("smoke", partnerPreferences?.smoke || "");
            if(gender === 'male'){
                
              }
            if(gender === 'female'){
                
            }
        }
      },[partnerPreferences,setValue])


      const [loading,setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
        console.log(data);
        setLoading(true);
        const response = await axios.put('/api/update-partner-preferences',{
            ...data,
            userId : userId
        })
        if(response.status === 200){
            console.log("User Partner Preferences Updated!")
        }
    } catch (error) {
        console.log(error);
    }finally{
        setLoading(false)
    }
}
  return (
    <div className='py-5' >
        <h2 className="text-xl font-bold tracking-tight">Partner Preferences</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='px-5 mt-5' >
            <div className='flex items-center justify-center gap-4' >
                <Label className="text-lg font-medium w-1/3 flex justify-end">Age Group From:</Label>
                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupFrom", value)} value={watch("ageGroupFrom")}  >
                    <SelectTrigger className="h-[40px]" >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {ageRange.map((age) => (
                            <SelectItem key={age} value={age} >{age}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {errors.ageGroupFrom && <p className="text-red-500 mt-2 text-sm">{errors.ageGroupFrom.message}</p>}
                            
            <div className='mt-4 flex items-center justify-center gap-4' >
                <Label className="text-lg font-medium w-1/3 flex justify-end">Age Group To:</Label>
                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupTo", value)} value={watch("ageGroupTo")}  >
                    <SelectTrigger className="col-span-1 h-[40px]" >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {ageRange.map((age) => (
                            <SelectItem key={age} value={age} >{age}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {errors.ageGroupTo && <p className="text-red-500 mt-2 text-sm">{errors.ageGroupTo.message}</p>}

             <div className="mt-4 flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end" >State: </Label>
                       <Select  onValueChange={(value) => setValue("state", value)} value={watch("state")}  >
                            <SelectTrigger className="h-[40px]" >
                                <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                            <SelectContent>
                                {US_STATES.map((state) => (
                                    <SelectItem key={state} value={state} >{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                    </div>        
                    {errors.state && <p className="text-red-500 mt-2 text-sm">{errors.state.message}</p>}


                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <label className="text-lg font-medium w-1/3 flex justify-end">Religiousity Preference</label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("relegiousPrefrence", value)} value={watch("relegiousPrefrence")}  >
                            <SelectTrigger className="h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Religious" >Religious</SelectItem>
                                <SelectItem value="Moderate" >Moderate</SelectItem>
                                <SelectItem value="Liberal" >Liberal</SelectItem>
                                <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                            </SelectContent>
                        </Select>
                        
                    </div>
                    {errors.relegiousPrefrence && <p className="text-red-500 mt-2 text-sm">{errors.relegiousPrefrence.message}</p>}


                    {gender === 'male' && (
                        <div className="mt-4 flex items-center justify-center gap-4" >
                            <label className="text-lg font-medium w-1/3 flex justify-end">Do you prefer a sister who wears the hijab?</label>
                            
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("hijab", value)} value={watch("hijab")}  >
                                    <SelectTrigger className="h-[40px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                                    </SelectContent>
                                </Select>
                            
                        </div>
                        
                    )}
                    {errors.hijab && <p className="text-red-500 mt-2 text-sm">{errors.hijab.message}</p>}


                    {gender === 'female' && (
                        <div className="mt-4 flex items-center justify-center gap-4" >
                            <label className="text-lg font-medium w-1/3 flex justify-end">Would you consider a brother who smokes?</label>
                           
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("smoke", value)} value={watch("smoke")}  >
                                    <SelectTrigger className="h-[40px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                                    </SelectContent>
                                </Select>
                            
                            
                        </div>
                    )}

{errors.smoke && <p className="text-red-500 mt-2 text-sm">{errors.smoke.message}</p>}

<div className="mt-4 flex items-center justify-center gap-4" >
                        <label className="text-lg font-medium w-1/3 flex justify-end">Ethnicity Preference</label>
                     
                        <Select onValueChange={(value) => setValue("ethnicityPrefrence", value)} value={watch("ethnicityPrefrence")}  >
                            <SelectTrigger className="h-[40px]" >
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
                                <SelectItem value="Any" >Any</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        
                    </div>
                    {errors.ethnicityPrefrence && <p className="text-red-500 mt-2 text-sm">{errors.ethnicityPrefrence.message}</p>}

                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <label className="text-lg font-medium w-1/3 flex justify-end">Education Level</label>
                        
                        <Select onValueChange={(value) => setValue("educationLevel", value)} value={watch("educationLevel")}  >
                            <SelectTrigger className="h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High School Diploma" >High School Diploma</SelectItem>
                                <SelectItem value="College / University" >College / University</SelectItem>
                                <SelectItem value="Career Institute" >Career Institute</SelectItem>
                                <SelectItem value="Masters Degree" >Masters Degree</SelectItem>
                                <SelectItem value="Skilled Trade" >Skilled Trade</SelectItem>
                                <SelectItem value="Any" >Any</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.educationLevel && <p className="text-red-500 mt-2 text-sm">{errors.educationLevel.message}</p>}
                    </div>


                    < div className="mt-4 flex items-center justify-center gap-4" >
                        <label className="text-lg font-medium w-1/3 flex justify-end">
                            {gender === 'male' ? 'Work: Your husband wants you to be...' :'Work: Are you looking for...'}
                        </label>
                        
                        <Select onValueChange={(value) => setValue("work", value)} value={watch("work")}  >
                            <SelectTrigger className="h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A career driven woman" >A career driven woman</SelectItem>
                                <SelectItem value="Housewife" >Housewife</SelectItem>
                                <SelectItem value="Doesn’t Matter" >Doesn’t Matter</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        
                    </div>
                    {errors.work && <p className="text-red-500 mt-2 text-sm">{errors.work.message}</p>}

                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <label className="text-lg font-medium w-1/3 flex justify-end">
                            Are you willing to consider someone with children?
                        </label>
                        <Select onValueChange={(value) => setValue("considerSomeoneHavingChildren", value)} value={watch("considerSomeoneHavingChildren")}  >
                            <SelectTrigger className="h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Maybe" >Maybe</SelectItem>
                            </SelectContent>
                        </Select>
                        
                    </div>
                    {errors.considerSomeoneHavingChildren && <p className="text-red-500 mt-2 text-sm">{errors.considerSomeoneHavingChildren.message}</p>}


                    <div className='flex items-center justify-end mt-5' >
                        <Button type='submit' >{loading ? "Saving" : 'Save Changes'}</Button>
                    </div>

        </form>
    </div>
  )
}

export default PartnerPreferences