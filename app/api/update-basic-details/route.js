import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req){
    try {
        const {userId, city, state , profileCreatedBy, adminVerificationStatus} = await req.json();

        console.log(userId, city, state , profileCreatedBy, adminVerificationStatus)

        let booleanAdmin;
        if(adminVerificationStatus === 'true'){
            booleanAdmin = true
        }else{
            booleanAdmin = false
        }

        const existingUser = await prisma.user.update({
            where : {id : userId},
            data : {
                city,
                state,
                profileCreatedBy,
                adminVerificationStatus : booleanAdmin
            }
        })

        console.log(existingUser);

        return NextResponse.json({message : "User Updated!" , user : existingUser}, {status : 200});
        
    } catch (error) {
        console.error("PUT BASIC DETAILS: ", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}