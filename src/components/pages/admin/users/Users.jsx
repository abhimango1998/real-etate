"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

import { Typography } from "@mui/material";
import { toast } from "react-toastify";

import ReusableTable from "@/components/common/ReusableTable";
import UserForm from "@/components/forms/users/UserForm";
import ReasuableModal from "@/components/common/ReusableModal";

import DashboardPageHeader from "@/components/common/DashboardPageHeader";
import { usersColumns } from "@/components/tableColumns/userColumns";

const Users = () => {
  const token = useSelector((state) => state.auth.token);
  const userData = useSelector((state) => state.auth.user);
  const userRolePermissions = userData?.role?.permissions || [];

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);

  const [hasCreatePermission, setHasCreatePermission] = useState(false);

  useEffect(() => {
    const userRolePermissions = userData?.role?.permissions || [];

    setHasCreatePermission(
      userRolePermissions.some(
        (p) => p.permission_type === "create" && p.permission_name === "users",
      ),
    );
  }, [userData]);

  const hasUpdatePermission = userRolePermissions.some(
    (p) => p.permission_type === "update" && p.permission_name === "users",
  );

  const hasDeletePermission = userRolePermissions.some(
    (p) => p.permission_type === "delete" && p.permission_name === "users",
  );

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/users?search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      // Transform API data to match table structure
      const transformedData = data?.data?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user?.role?.name,
        roleId: user?.role?.id,
      }));

      setData(transformedData);
      setTotalPages(data?.meta?.last_page);
      setTotalItems(data?.meta?.total);
      setCurrentPage(data?.meta?.current_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, token, itemsPerPage]);

  const handleDelete = useCallback((userId) => {
    setDeleteModalOpen(true);
    setUserToDelete(userId);
  }, []);

  const handleDeleteConfirm = async () => {
    await deleteUser(userToDelete);
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const deleteUser = async (id) => {
    if (userToDelete) {
      setDeleteLoading(true);

      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          toast.success("User deleted successfully");
          fetchData();
        } else {
          toast.error("Error deleting user");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
    fetchData();
  };

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setModalTitle("Edit User");
    setModalOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setModalTitle("Add User");
    setModalOpen(true);
  };

  const columns = useMemo(
    () =>
      usersColumns({
        hasUpdatePermission,
        hasDeletePermission,
        handleEdit,
        handleDelete,
      }),
    [hasUpdatePermission, hasDeletePermission, handleEdit, handleDelete],
  );

  return (
    <>
      <Grid container spacing={6}>
        <DashboardPageHeader
          isShowButton={hasCreatePermission}
          title={"User Table"}
          btnText={"Add User"}
          handleClick={handleAdd}
        />
        <Grid item xs={12}>
          <ReusableTable
            columns={columns}
            data={data}
            loading={loading}
            searchQuery={searchQuery}
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </Grid>
      </Grid>

      <ReasuableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <UserForm user={selectedUser} onClose={handleModalClose} />
      </ReasuableModal>

      <ReasuableModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        title={"Delete User"}
        onConfirmDelete={handleDeleteConfirm}
        loading={deleteLoading}
        disabled={deleteLoading}
        showDeleteButton={true}
      >
        <Typography variant="body1">
          Are you sure you want to delete this user?
        </Typography>
      </ReasuableModal>
    </>
  );
};

export default Users;
