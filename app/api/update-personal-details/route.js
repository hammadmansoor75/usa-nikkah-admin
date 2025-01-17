import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
      const {
        aboutMe, height, maritalStatus, children, childrenLiving, moreKids,
        ethnicBackground, occupation, hobbies, education, userId
      } = await req.json();
  
      // Validate fields
      if (!aboutMe || !height || !maritalStatus || !children || !moreKids ||
        !ethnicBackground || !occupation || !hobbies || !education || !userId) {
        return NextResponse.json({ error: "All Fields are required" }, { status: 400 });
      }
  
      // Update personal details in the database
      const updatedPersonalDetails = await prisma.personalDetails.update({
        where: { userId: userId },
        data: {
          aboutMe,
          height,
          maritalStatus,
          children,
          childrenLiving : childrenLiving || "N/A",
          moreKids,
          ethnicBackground,
          occupation,
          hobbies,
          education,
        },
      });
  
      return NextResponse.json(updatedPersonalDetails, { status: 200 });
    } catch (error) {
      console.error("PERSONAL DETAILS UPDATE: ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }