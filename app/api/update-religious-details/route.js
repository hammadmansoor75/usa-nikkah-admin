import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { userId, religiosity, prayer, revert, revertDuration, mosqueVisit, smoke, hijab, considerWearingHijab } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Update religious details
        const updatedReligiousDetails = await prisma.religiousDetails.update({
            where: {
                userId: userId,
            },
            data: {
                religiosity,
                prayer,
                revert,
                revertDuration,
                mosqueVisit,
                smoke,
                hijab,
                considerWearingHijab,
            },
        });

        return NextResponse.json({message : "User Religious Details Updated" , religiousDetails : updatedReligiousDetails}, { status: 200 });
    } catch (error) {
        console.error("RELEGIOUS DETAILS UPDATE: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

