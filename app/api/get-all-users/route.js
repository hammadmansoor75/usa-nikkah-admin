import prisma from "@/prisma/client";
import { NextResponse } from "next/server";


export async function GET(req){
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users , {status : 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Internal Server Error"}, {status : 500})
    }
}