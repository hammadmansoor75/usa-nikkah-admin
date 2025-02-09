"use client";

import BasicDetails from '@/components/BasicDetails';
import PartnerPreferences from '@/components/PartnerPreferences';
import PersonalDetails from '@/components/PersonalDetails';
import ReligiousDetails from '@/components/ReligiousDetails';
import { Button } from '@/components/ui/button';
import UserImages from '@/components/UserImages';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const UserPage = () => {
    const [user, setUser] = useState();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Track dialog visibility
    const router = useRouter();

    useEffect(() => {
        const getUserById = async (userId) => {
            const response = await axios.get(`/api/get-user-by-id?userId=${userId}`);
            if (response.status === 200) {
                setUser(response.data);
            } else {
                console.log(response.data);
            }
        };

        if (typeof window !== 'undefined') {
            const urlPath = window.location.pathname;
            const idFromPath = urlPath.split("/").pop();
            if (idFromPath) {
                getUserById(idFromPath);
            }
        }
    }, []);

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            const response = await axios.delete(`/api/get-user-by-id?userId=${user?.id}`);
            if (response.status === 200) {
                router.push('/users');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false); // Close the dialog after deletion
        }
    };

    return (
        <main className="px-10 py-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight capitalize">{user?.name}</h2>
                    <p className="text-xl mt-2">User Id: <span className="font-medium">{user?.id}</span></p>
                    <p className="text-xl">Email: {user?.email}</p>
                    <p className="text-xl capitalize">{user?.gender} -- {user?.age} -- {user?.dob}</p>
                    <Button
                        onClick={() => setShowDeleteDialog(true)} // Open dialog on click
                        variant="destructive"
                        className="mt-5 font-medium py-3"
                    >
                        {deleteLoading ? "Deleting..." : "Delete User"}
                    </Button>
                </div>
                <div className="overflow-hidden rounded-full border-2 border-blue-950 w-30 h-30">
                    {user && (
                        <Image
                            className="object-cover w-full h-full"
                            src={user?.images.profilePhoto}
                            alt="profile"
                            width={100}
                            height={100}
                        />
                    )}
                </div>
            </div>

            <BasicDetails user={user} />
            <PersonalDetails personalDetails={user?.personalDetails} userId={user?.id} />
            <ReligiousDetails religiousDetails={user?.relegiousDetails} userId={user?.id} gender={user?.gender} />
            <PartnerPreferences partnerPreferences={user?.partnerPrefrences} userId={user?.id} gender={user?.gender} />
            <UserImages images={user?.images} userId={user?.id} />

            {/* DELETE CONFIRMATION DIALOG */}
            {showDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                        <h2 className="text-lg font-bold text-red-600">Confirm Deletion</h2>
                        <p className="text-gray-700 mt-2">
                            Are you sure you want to delete <span className="font-bold capitalize">{user?.name}</span>? 
                            This action cannot be undone.
                        </p>
                        <div className="mt-5 flex justify-center gap-4">
                            <Button onClick={() => setShowDeleteDialog(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} variant="destructive">
                                {deleteLoading ? "Deleting..." : "Confirm Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserPage;
