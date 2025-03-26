"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";

import { toast } from "react-toastify";

import ReusableTable from "@/components/common/ReusableTable";
import ReusableModal from "@/components/common/ReusableModal";
import RolesForm from "@/components/forms/roles/RolesForm";

import PermissionsViews from "@/components/permissions/PermissionsViews";
import DashboardPageHeader from "@/components/common/DashboardPageHeader";
import { rolesColumns } from "@/components/tableColumns/roleColumns";

const Roles = () => {
  const token = useSelector((state) => state.auth.token);
  const userData = useSelector((state) => state.auth.user);
  const userRolePermissions = userData?.role?.permissions || [];

  const [selectedRole, setSelectedRole] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasCreatePermission, setHasCreatePermission] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const userRolePermissions = userData?.role?.permissions || [];

    setHasCreatePermission(
      userRolePermissions.some(
        (p) => p.permission_type === "create" && p.permission_name === "roles",
      ),
    );
  }, [userData]);

  // Check if user has specific permissions
  const hasUpdatePermission = userRolePermissions.some(
    (p) => p.permission_type === "update" && p.permission_name === "roles",
  );

  const hasDeletePermission = userRolePermissions.some(
    (p) => p.permission_type === "delete" && p.permission_name === "roles",
  );

  const handlePermissionsModalClose = () => {
    setPermissionsModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const fetchRoles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/roles?search=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setData(data.data);
      setTotalPages(data?.meta?.last_page);
      setTotalItems(data?.meta?.total);
      setCurrentPage(data?.meta?.current_page);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, token, itemsPerPage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/permissions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setPermissions(data?.permissions);
    } catch (error) {
      console.error("error", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleDelete = useCallback((userId) => {
    setDeleteModalOpen(true);
    setRoleToDelete(userId);
  }, []);

  const handleDeleteConfirm = async () => {
    await deleteRole(roleToDelete);
    setDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const deleteRole = async (roleId) => {
    if (roleId) {
      setDeleteLoading(true);

      try {
        const response = await fetch(`/api/admin/roles/${roleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          toast.success("Role deleted successfully");
          fetchRoles();
        } else {
          toast.error("Error deleting role");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRole(null);
    fetchRoles();
  };

  const handleEdit = useCallback((role) => {
    setSelectedRole(role);
    setModalTitle("Edit Role");
    setModalOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedRole(null);
    setModalTitle("Add Role");
    setModalOpen(true);
  };

  const columns = useMemo(
    () =>
      rolesColumns({
        setSelectedPermission,
        setPermissionsModalOpen,
        handleEdit,
        handleDelete,
        hasUpdatePermission,
        hasDeletePermission,
      }),
    [
      setSelectedPermission,
      setPermissionsModalOpen,
      handleEdit,
      handleDelete,
      hasUpdatePermission,
      hasDeletePermission,
    ],
  );

  return (
    <>
      <Grid container spacing={6}>
        <DashboardPageHeader
          isShowButton={hasCreatePermission}
          title={"Roles Table"}
          btnText={"Add Role"}
          handleClick={handleAdd}
        />
        <Grid item xs={12}>
          <ReusableTable
            columns={columns}
            data={data}
            loading={loading}
            searchQuery={searchQuery}
            onSearch={(query) => setSearchQuery(query)}
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

      <ReusableModal
        open={permissionsModalOpen}
        onClose={handlePermissionsModalClose}
        title={"Permissions"}
      >
        <PermissionsViews permissions={selectedPermission} />
      </ReusableModal>

      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <RolesForm
          permissions={permissions}
          role={selectedRole}
          onClose={handleModalClose}
        />
      </ReusableModal>

      <ReusableModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        title={"Delete Role"}
        onConfirmDelete={handleDeleteConfirm}
        loading={deleteLoading}
        disabled={deleteLoading}
        showDeleteButton={true}
      >
        <Typography variant="body1">
          Are you sure you want to delete this role?
        </Typography>
      </ReusableModal>
    </>
  );
};

export default Roles;
