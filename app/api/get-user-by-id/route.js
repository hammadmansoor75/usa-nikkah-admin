import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const userId = req.nextUrl.searchParams.get("userId");
        console.log("User Id" , userId)

        const user = await prisma.user.findUnique({
            where : {id : userId},
            include: {
                personalDetails: true, // Include personal details
                partnerPrefrences: true, // Include partner preferences
                relegiousDetails: true, // Include religious details
                images: true, // Include images
            },
        })

        return NextResponse.json(user, {status : 200});
    } catch (error) {
        console.log("GET USER BY ID : ", error);
        return NextResponse.json({message : "Internal Server Error"}, {status : 500})
    }
}


export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      userId, // User ID for identification
      user, // Object containing User fields to update
      personalDetails, // Object containing PersonalDetails fields to update
      partnerPreferences, // Object containing PartnerPreferences fields to update
      religiousDetails, // Object containing ReligiousDetails fields to update
      images, // Object containing Images fields to update
    } = body;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...user, // Spread the fields for updating primary user data
      },
    });

    // Update related tables if provided
    if (personalDetails) {
      await prisma.personalDetails.update({
        where: { userId: userId },
        data: {
          ...personalDetails,
        },
      });
    }

    if (partnerPreferences) {
      await prisma.partnerPreferences.update({
        where: { userId: userId },
        data: {
          ...partnerPreferences,
        },
      });
    }

    if (religiousDetails) {
      await prisma.religiousDetails.update({
        where: { userId: userId },
        data: {
          ...religiousDetails,
        },
      });
    }

    if (images) {
      await prisma.images.update({
        where: { userId: userId },
        data: {
          ...images,
        },
      });
    }

    return NextResponse.json(
      { message: "User updated successfully", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT USER: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Delete associated data in dependent tables
    await prisma.personalDetails.deleteMany({ where: { userId } });
    await prisma.partnerPreferences.deleteMany({ where: { userId } });
    await prisma.religiousDetails.deleteMany({ where: { userId } });
    await prisma.images.deleteMany({ where: { userId } });

    // Delete the main user record
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User and associated data deleted successfully", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
