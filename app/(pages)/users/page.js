"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectContent, SelectValue } from "@radix-ui/react-select";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For displaying filtered data
  const [filters, setFilters] = useState({
    searchQuery: "",
    id: "",
    age: "",
    adminVerificationStatus: "",
  }); // Filters state

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axios.get("/api/get-all-users");
      if (response.status === 200) {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filteredUsers with all users
        console.log("GET ALL USERS: ", response.data);
      } else {
        console.log("GET ALL USERS: ", response.data);
      }
    };
    getAllUsers();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = filters.searchQuery.toLowerCase();

    // Apply multiple filters
    const filtered = users.filter((user) => {
      const matchesNameOrEmail =
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery);

      const matchesId =
        !filters.id || user.id.toString().includes(filters.id);

      const matchesAge =
        !filters.age || user.age.toString() === filters.age;

      const matchesVerification =
        filters.adminVerificationStatus === "" ||
        user.adminVerificationStatus.toString() ===
          filters.adminVerificationStatus;

      return (
        matchesNameOrEmail &&
        matchesId &&
        matchesAge &&
        matchesVerification
      );
    });

    setFilteredUsers(filtered);
  }, [filters, users]);

  // Update individual filters
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="px-10 py-5">
     
      {/* Filter Inputs */}

      <div className="mt-5" > 
        {/* <h2 className="text-xl font-semibold" >Search Users</h2> */}
        <div className="mt-2 flex items-center justify-center gap-4" >
            <Input
            type="text"
            placeholder="Search by name or email"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="border h-10 rounded-md py-2 px-4 text-lg"
            />
            <Input
                type="text"
                placeholder="Filter by ID"
                value={filters.id}
                onChange={(e) => handleFilterChange("id", e.target.value)}
                className="border h-10 rounded-md py-2 px-4 text-lg"
            />
            <Input
                type="number"
                placeholder="Filter by age"
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
                className="border rounded-md h-10 py-2 px-4 text-lg"
            />
            <select
                value={filters.adminVerificationStatus}
                onChange={(e) =>
                    handleFilterChange("adminVerificationStatus", e.target.value)
                }
                className="border rounded-md py-2 h-10 px-4 text-md text-gray-500"
            >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
            </select>
            
        </div>
      </div>
      
        

      <h2 className="text-3xl mt-10 font-bold tracking-tight">Users</h2>
      {/* Data Table */}
      <div className="mt-5">
        <DataTable columns={columns} data={filteredUsers} />
      </div>
    </main>
  );
};

export default UsersPage;
