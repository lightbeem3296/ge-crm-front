"use client";

import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { UserCount, UserRole } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [userTotalCount, setUserTotalCount] = useState<number | undefined>(0);
  const [userAdminCount, setUserAdminCount] = useState<number | undefined>(0);
  const [userUserCount, setUserUserCount] = useState<number | undefined>(0);
  const [userInactiveCount, setUserInactiveCount] = useState<number | undefined>(0);
  const [employeeCount, setEmployeeCount] = useState<number | undefined>(0);
  const [ruleCount, setRuleCount] = useState<number | undefined>(0);
  const [tagCount, setTagCount] = useState<number | undefined>(0);
  const [roleCount, setRoleCount] = useState<number | undefined>(0);
  const [salaryTypeCount, setSalaryTypeCount] = useState<number | undefined>(0);

  const currentUser = loadCurrentUser();

  const fetchData = async () => {
    if (currentUser?.role === UserRole.ADMIN) {
      const response = await axiosHelper.get<UserCount>("/user/count");
      setUserTotalCount(response?.total)
      setUserAdminCount(response?.admin)
      setUserUserCount(response?.user)
      setUserInactiveCount(response?.inactive)
    }

    setEmployeeCount(await axiosHelper.get<number>("/employee/count"));
    setRuleCount(await axiosHelper.get<number>("/rule/count"));
    setTagCount(await axiosHelper.get<number>("/tag/count"));
    setRoleCount(await axiosHelper.get<number>("/role/count"));
    setSalaryTypeCount(await axiosHelper.get<number>("/salary-type/count"));
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 min-h-[calc(100vh-6.4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {
          currentUser?.role === UserRole.ADMIN
            ? <div className="card bg-error text-white col-span-1 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Users</h2>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">
                    <p>Total: {userTotalCount} Users</p>
                  </div>
                  <div className="col-span-1">
                    <p>Administrator: {userAdminCount}</p>
                    <p>User: {userUserCount}</p>
                    <p>Inactive: {userInactiveCount}</p>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link href="/main/data/user">
                    <button className="btn btn-ghost">
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            : null
        }
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="card bg-primary text-white col-span-1 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Employees</h2>
            <p>Total: {employeeCount} Employees</p>
            <div className="card-actions justify-end">
              <Link href="/main/data/employee">
                <button className="btn btn-ghost">
                  Manage
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-success text-white col-span-1 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Rules</h2>
            <p>Total: {ruleCount} Rules</p>
            <div className="card-actions justify-end">
              <Link href="/main/data/rule">
                <button className="btn btn-ghost">
                  Manage
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-info text-white col-span-1 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Tags</h2>
            <p>Total: {tagCount} Tags</p>
            <div className="card-actions justify-end">
              <Link href="/main/data/tag">
                <button className="btn btn-ghost">
                  Manage
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-warning text-white col-span-1 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Roles</h2>
            <p>Total: {roleCount} Roles</p>
            <div className="card-actions justify-end">
              <Link href="/main/data/role">
                <button className="btn btn-ghost">
                  Manage
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-secondary text-white col-span-1 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Salary Types</h2>
            <p>Total: {salaryTypeCount} Salary Types</p>
            <div className="card-actions justify-end">
              <Link href="/main/data/salary-type">
                <button className="btn btn-ghost">
                  Manage
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
