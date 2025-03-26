"use client";

import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { toast } from "react-toastify";

import CustomTextField from "@core/components/mui/TextField";
import { UserFormValidationSchema } from "@/utils/formValidations";

import CustomButton from "@/components/common/CustomButton";

const UserForm = ({ user, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
    },
    resolver: yupResolver(UserFormValidationSchema(!user)),
  });

  const selectedRole = watch("role_id");

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setRoles(data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("password", "");
      setValue("password_confirmation", "");
      setValue("role_id", user.roleId);
    }
  }, [user, setValue]);

  const handleFormSubmit = async (formData) => {
    setSubmitLoading(true);

    if (!formData.password && !formData.password_confirmation) {
      delete formData.password;
      delete formData.password_confirmation;
    }

    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = user ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);

        return;
      }

      reset();
      onClose();
      toast.success(
        user ? "User updated successfully" : "User created successfully",
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CustomTextField
            {...register("name")}
            fullWidth
            label="Name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            {...register("email")}
            fullWidth
            type="email"
            label="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            {...register("password")}
            fullWidth
            label="Password"
            type={isPasswordShown ? "text" : "password"}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <i
                      className={
                        isPasswordShown ? "tabler-eye-off" : "tabler-eye"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            {...register("password_confirmation")}
            fullWidth
            label="Confirm Password"
            type={isConfirmPasswordShown ? "text" : "password"}
            error={Boolean(errors.password_confirmation)}
            helperText={errors.password_confirmation?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setIsConfirmPasswordShown(!isConfirmPasswordShown)
                    }
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <i
                      className={
                        isConfirmPasswordShown ? "tabler-eye-off" : "tabler-eye"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            select
            fullWidth
            label="Role"
            value={selectedRole}
            onChange={(e) =>
              setValue("role_id", e.target.value, { shouldValidate: true })
            }
            error={!!errors.role_id}
            helperText={errors.role_id?.message}
          >
            <MenuItem value="" disabled>
              <em>None</em>
            </MenuItem>
            {roles?.length > 0 ? (
              roles?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {/* {role.name === 'superadmin' ? 'Super Admin' : 'Admin'} */}
                  {role.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={"5"}>Users</MenuItem>
            )}
          </CustomTextField>
        </Grid>
        <Grid item xs={12}>
          <CustomButton
            loading={submitLoading}
            variant={"contained"}
            type={"submit"}
            disabled={submitLoading}
          >
            {user ? "Update" : "Create"}
          </CustomButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
