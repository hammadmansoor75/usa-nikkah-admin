import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req){
    try {
        const {adminVerificationStatus, id} = await req.json();

        let booleanAdmin;
        if(adminVerificationStatus === 'true'){
            booleanAdmin = true
        }else{
            booleanAdmin = false
        }

        const updatedImage = await prisma.images.update({
            where : {id : id},
            data : {
                adminVerificationStatus : booleanAdmin
            }
        })

        return NextResponse.json({message : "Images Updated"} , {images : updatedImage}, {status : 200})
    } catch (error) {
        console.error("PUT Images: ", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}