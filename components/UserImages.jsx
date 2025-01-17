"use client";

import React, { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import Image from 'next/image'; // Ensure Image is imported correctly

const imageVerificationSchema = z.object({
    adminVerificationStatus: z.string(),
});

const UserImages = ({ images, userId }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(imageVerificationSchema),
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (images) {
            setValue("adminVerificationStatus", images.adminVerificationStatus || "");
        }
    }, [setValue, images]);


    const onSubmit = async (data) => {
        try {
            setLoading(true)
            console.log(data);
            const response = await axios.put('/api/update-image', {
                id : images?.id,
                adminVerificationStatus : data.adminVerificationStatus
            })
            if(response.status === 200){
                console.log("Image Verification Status Updated")
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="py-5">
            <h2 className="text-xl font-bold tracking-tight">User Images</h2>
            <div className="flex mt-5 items-center justify-center flex-wrap gap-4">
                {images?.photos && images?.photos.length > 0 &&
                    images.photos.map((image) => (
                        <div
                            className="overflow-hidden rounded-md border border-blue-950 h-[96] w-[96]"
                            key={image}
                        >
                            <Image src={image} alt="user-image" height={100} width={100} />
                        </div>
                ))}
                {images?.photos.length === 0 && (
                    <p className='text-center text-md font-medium text-black' >No User Images</p>
                )}
            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight">User Selfie</h2>
            {images?.selfiePhoto && (
                <div className="flex items-center justify-center mt-5">
                    <div className="overflow-hidden rounded-md border border-blue-950 h-[96] w-[96]">
                        <Image src={images.selfiePhoto} alt="user-image" height={100} width={100} />
                    </div>
                </div>
            )}

            <h2 className="mt-5 text-xl font-bold tracking-tight">Image Verification: </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="py-5">
                <div className="mt-4 flex items-center justify-center gap-4">
                    <Label className="text-lg font-medium w-1/3 flex justify-end">
                        Image Verification Status:
                    </Label>
                    <Select
                        onValueChange={(value) => setValue("adminVerificationStatus", value)}
                        value={watch("adminVerificationStatus")}
                    >
                        <SelectTrigger className="h-[40px]">
                            <SelectValue
                                className="text-sub_text_2"
                                placeholder="Select an option"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Approve</SelectItem>
                            <SelectItem value="false">Reject</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.adminVerificationStatus && (
                        <p className="text-red-500 mt-2 text-sm">
                            {errors.adminVerificationStatus.message}
                        </p>
                    )}
                </div>


                <div className='mt-5 flex items-center justify-end' >
                    <Button type="submit" >{loading ? "Saving" : 'Save Changes'}</Button>
                </div>
            </form>
        </div>
    );
};

export default UserImages;
