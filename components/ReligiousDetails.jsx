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

const generateRelegiousSchema = (gender) => {
  const commonRelegiousSchema = z.object({
      religiosity : z.string().nonempty({message : "This field is required"}),
      prayer : z.string().nonempty({message : "This field is required"}),
      revert: z.enum(["yes", "no"], { message: "This field is required" }),
      revertDuration : z.string().optional().default(""),
      mosqueVisit : z.string().nonempty({message : "This field is required"}),
  })
  
  const maleRelegiousSchema = z.object({
      smoke: z.enum(["yes", "no"], { message: "This field is required" }),
  })
  
  const femaleRelegiousSchema = z.object({
      hijab: z.enum(["yes", "no"], { message: "This field is required" }),
      considerWearingHijab : z.string().optional(),
  })

  return gender === "male"
  ? commonRelegiousSchema.merge(maleRelegiousSchema)
  : commonRelegiousSchema.merge(femaleRelegiousSchema);
}

const ReligiousDetails = ({religiousDetails, gender, userId}) => {
  const schema = generateRelegiousSchema(gender);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

 

  useEffect(() => {
    if(religiousDetails){
            console.log(religiousDetails);
            setValue("religiosity", religiousDetails.religiosity || "");
            setValue("prayer", religiousDetails.prayer || "");
            setValue("revert", religiousDetails.revert || "");
            setValue("revertDuration", religiousDetails.revertDuration || "");
            setValue("mosqueVisit", religiousDetails.mosqueVisit || "");

            if (gender === "male") {
              setValue("smoke", religiousDetails.smoke || "");
            }
            if (gender === "female") {
              setValue("hijab", religiousDetails.hijab || "");
              setValue("considerWearingHijab", religiousDetails.considerWearingHijab || "");
            }
    }
  },[religiousDetails,setValue])

  const [loading,setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
        console.log(data);
        setLoading(true);
        const response = await axios.put('/api/update-religious-details',{
            ...data,
            userId : userId
        })
        if(response.status === 200){
            console.log("User Religious Details Updated!")
        }
    } catch (error) {
        console.log(error);
    }finally{
        setLoading(false)
    }
}

  return (
    <div className='py-5' >
        <h2 className="text-xl font-bold tracking-tight">Religious Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='px-5 mt-5' >
          <div className="flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end">Religiosity:</Label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("religiosity", value)} value={watch("religiosity")} >
                            <SelectTrigger className="h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Relegious" >Religious</SelectItem>
                                <SelectItem value="Moderate" >Moderate</SelectItem>
                                <SelectItem value="Liberal" >Liberal</SelectItem>
                            </SelectContent>
                        </Select>
                        
                    </div>
                    {errors.religiosity && <p className="text-red-500 mt-2 text-sm">{errors.religiosity.message}</p>}
          

                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end">Your Prayer</Label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("prayer", value)} value={watch("prayer")} >
                            <SelectTrigger className="col-span-2 h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Always Pray" >Always Pray</SelectItem>
                                <SelectItem value="Usually Pray" >Usually Pray</SelectItem>
                                <SelectItem value="Sometimes Pray" >Sometimes Pray</SelectItem>
                                <SelectItem value="Hardly Pray" >Hardly Pray</SelectItem>
                                <SelectItem value="Never Pray" >Never Pray</SelectItem>
                            </SelectContent>
                        </Select>
                        
                    </div>
                    {errors.prayer && <p className="text-red-500 mt-2 text-sm">{errors.prayer.message}</p>}



                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end" >Are you a Revert?</Label>
                        <RadioGroup
                            onValueChange={(value) => setValue("revert", value)}
                            value={watch("revert")}
                            className="flex items-center justify-end"
                        >
                            <RadioGroupItem value="yes" id="yes" />
                            <label htmlFor="yes" className='text-sm' >Yes</label>

                            <RadioGroupItem value="no" id="no" />
                            <label htmlFor="no" className='text-sm' >No</label>
                        </RadioGroup>
                        
                    </div>
                    {errors.revert && <p className="text-red-500 mt-2 text-sm">{errors.revert.message}</p>}


                    <div className='mt-4 flex items-center justify-center gap-4' >
                        <Label className="text-lg font-medium w-1/3 flex justify-end">If yes, how long?</Label>
                        <Input {...register("revertDuration")} placeholder="Example: 5 years" className="w-full h-[40px]"  />
                    </div>
                    {errors.revertDuration && <p className="text-red-500 text-sm mt-2" >{errors.revertDuration.message}</p>}

                    <div className="mt-4 flex items-center justify-center gap-4" >
                        <Label className="text-lg font-medium w-1/3 flex justify-end">How often do you visit the masjid?</Label>
                        <Select   onValueChange={(value) => setValue("mosqueVisit", value)} value={watch("mosqueVisit")} >
                            <SelectTrigger className="h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Daily" >Daily</SelectItem>
                                <SelectItem value="2-3 Times a week" >2-3 Times a week</SelectItem>
                                <SelectItem value="Once a week" >Once a week</SelectItem>
                                <SelectItem value="Occasionally" >Occasionally</SelectItem>
                                <SelectItem value="Rarely" >Rarely</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.prayer && <p className="text-red-500 mt-2 text-sm">{errors.prayer.message}</p>}
                    </div>


                    {gender === 'male' && (
                        <div>
                            <div className="mt-4 flex items-center justify-center gap-4" >
                                <Label className="text-lg font-medium w-1/3 flex justify-end" >Do you smoke?</Label>
                                <RadioGroup
                                    onValueChange={(value) => setValue("smoke", value)}
                                    value={watch("smoke")}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RadioGroupItem value="yes" id="yes" />
                                    <label htmlFor="yes" className='text-sm' >Yes</label>

                                    <RadioGroupItem value="no" id="no" />
                                    <label htmlFor="no" className='text-sm' >No</label>
                                </RadioGroup>
                                
                            </div>
                            {errors.smoke && <p className="text-red-500 mt-2 text-sm">{errors.smoke.message}</p>}
                        </div>
                    )}


                    {gender === 'female' && (
                        <div>
                            <div className="mt-4 flex items-center justify-center gap-4" >
                                <Label className="text-lg font-medium w-1/3 flex justify-end" >Do you wear hijab?</Label>
                                <RadioGroup
                                    onValueChange={(value) => setValue("hijab", value)}
                                    value={watch("hijab")}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RadioGroupItem value="yes" id="yes" />
                                    <label htmlFor="yes" className='text-sm' >Yes</label>

                                    <RadioGroupItem value="no" id="no" />
                                    <label htmlFor="no" className='text-sm' >No</label>
                                </RadioGroup>
                                
                            </div>
                            {errors.hijab && <p className="text-red-500 mt-2 text-sm">{errors.hijab.message}</p>}

                            <div className="mt-4 flex items-center justify-center gap-4" >
                                <Label className="text-lg font-medium w-1/3 flex justify-end">If no, will you consider wearing it?</Label>
                                <Select className="text-sub_text_2 mt-2"  onValueChange={(value) => setValue("considerWearingHijab", value)} value={watch("considerWearingHijab")} >
                                    <SelectTrigger className="h-[40px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Maybe" >Maybe</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.considerWearingHijab && <p className="text-red-500 mt-2 text-sm">{errors.considerWearingHijab.message}</p>}
                            </div>
                        </div>
                    )}


                    <div className='mt-5 flex items-center justify-end' >
                      <Button type="submit" >{loading ? 'Saving' : "Save Changes"}</Button>
                    </div>

        </form>
    </div>
  )
}

export default ReligiousDetails