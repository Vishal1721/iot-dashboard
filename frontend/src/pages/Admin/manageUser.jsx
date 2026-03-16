import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteUser, getAllUser, updateUser } from "@/APIs/UserAPI";

import { Card, Menu, Table, Button } from "@/components/ui";
import { IconDotsVertical } from "justd-icons";
import { toast } from "sonner";

const ManageUser = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(user?.id);
        console.log("API Response:", response);
        setUsers(response.users);

        setChange(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [user?.id, change]);

  const handleDelete = async (userId) => {
    try {
      if (userId == user._id) {
        toast.error("You cannot delete yourself");
        return;
      }
      const response = await deleteUser(user?.id, userId);
      if (response.status === "success")
        setUsers(users.filter((users) => users.id !== userId));
      toast.success(response.message);
      setChange(!change);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = async (id, email, role) => {
    role = role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const response = await updateUser({
        id: user?.id,
        email: email,
        role: role,
      });
      console.log(response);
      if (response.status === "success") toast.success(response.message);
      setChange(!change);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="container mx-auto pt-10 p-4 sm:p-6 md:p-8 lg:p-10">
      <Card className="p-6 bg-gray-50 shadow-lg rounded-xl border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 pl-2 text-gray-800">
          Manage Users
        </h2>
        <div className="overflow-x-auto">
          <Table
            aria-label="Users"
            className="w-full border border-gray-200 rounded-lg overflow-hidden"
          >
            <Table.Header>
              <Table.Column
                isRowHeader
                className="py-3 px-4 text-left sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium"
              >
                ID
              </Table.Column>
              <Table.Column className="py-3 px-4 text-left sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium">
                Name
              </Table.Column>
              <Table.Column className="py-3 px-4 text-left sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium">
                Email
              </Table.Column>
              <Table.Column className="py-3 px-4 text-left sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium">
                Batch
              </Table.Column>
              <Table.Column className="py-3 px-4 text-left sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium">
                Role
              </Table.Column>
              <Table.Column className="py-3 px-4 text-center sm:text-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium">
                Actions
              </Table.Column>
            </Table.Header>
            <Table.Body items={users} className="divide-y divide-gray-200">
              {(user) => (
                <Table.Row
                  key={user?._id}
                  id={user?._id}
                  className="hover:bg-gray-100 transition-all even:bg-gray-50"
                >
                  <Table.Cell className="py-3 px-4 sm:text-lg text-gray-700">
                    {user?._id}
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 sm:text-lg text-gray-700">{`${user?.firstName} ${user?.lastName}`}</Table.Cell>
                  <Table.Cell className="py-3 px-4 sm:text-lg text-gray-700">
                    {user?.email}
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 sm:text-lg text-gray-700">
                    {user?.batch}
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 sm:text-lg">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        user?.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user?.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 w-8 text-center">
                    <Menu>
                      <Menu.Trigger>
                        <IconDotsVertical className="cursor-pointer text-gray-500 hover:text-gray-700 transition-all w-5 h-5" />
                      </Menu.Trigger>
                      <Menu.Content
                        aria-label="Actions"
                        placement="left top"
                        className="bg-white border border-gray-200 rounded-md shadow-lg"
                      >
                        <Menu.Item className="hover:bg-blue-50 text-blue-600 px-4 py-2.5 cursor-pointer transition-colors">
                          <div
                            className="w-full"
                            onClick={() =>
                              handleEdit(user?.id, user?.email, user?.role)
                            }
                          >
                            Make {user?.role === "ADMIN" ? "STUDENT" : "ADMIN"}
                          </div>
                        </Menu.Item>
                        <Menu.Separator className="border-t border-gray-200 my-1" />
                        <Menu.Item className="hover:bg-red-50 text-red-600 px-4 py-2.5 cursor-pointer transition-colors">
                          <div
                            className="w-full"
                            onClick={() => handleDelete(user?.id)}
                          >
                            Delete
                          </div>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ManageUser;
