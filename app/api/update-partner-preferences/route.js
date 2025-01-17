import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const {
            gender,
            ageGroupFrom,
            ageGroupTo,
            state,
            maritalStatus,
            religiousPreference,
            ethnicityPreference,
            educationLevel,
            work,
            considerSomeoneHavingChildren,
            smoke,
            hijab,
            userId
        } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedPreferences = await prisma.partnerPreferences.update({
            where: { userId },
            data: {
                gender,
                ageGroupFrom,
                ageGroupTo,
                state,
                maritalStatus,
                religiousPreference,
                ethnicityPreference,
                educationLevel,
                work,
                considerSomeoneHavingChildren,
                smoke,
                hijab,
            },
        });

        return NextResponse.json(updatedPreferences, { status: 200 });
    } catch (error) {
        console.error("PARTNER PREFERENCES UPDATE: ", error);

        if (error.code === "P2025") { // Prisma specific error for record not found
            return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

