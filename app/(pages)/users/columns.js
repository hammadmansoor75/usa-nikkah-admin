"use client"

import {ColumnDef} from '@tanstack/react-table'


export const columns = [
    {
        accessorKey : "id",
        header : "User Id"
    },
    {
        accessorKey : "name",
        header : "Name"
    },
    {
        accessorKey : "email",
        header : "Email"
    },
    {
        accessorKey : "age",
        header : "Age"
    },
    {
        accessorKey : "gender",
        header : "Gender"
    },
    {
        accessorKey : "adminVerificationStatus",
        header : "Admin Verification"
    },
    // {
    //     accessorKey : "createdAt",
    //     header : "Joined"
    // },
    // {
    //     accessorKey : "updatedAt",
    //     header : "Updated At"
    // }
]