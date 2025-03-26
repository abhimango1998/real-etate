"use client";
import { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/material";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";

import CollapsibleLayout from "@/components/common/CollapsibleLayout";
import CustomButton from "@/components/common/CustomButton";

import SMTPSettingForm from "@/components/forms/settings/SMTPSettingForm";
import TrestleSettingForm from "@/components/forms/settings/TrestleSettingForm";

const Settings = () => {
  const token = useSelector((state) => state.auth.token);
  const [SMPTSettingsData, setSMPTSettingsData] = useState(null);
  const [TrestleSettingsData, setTrestleSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      smtp: {
        from_address: "",
        host: "",
        port: "",
        username: "",
        password: "",
        encryption: "",
      },
      trestle: {
        client_id: "",
        client_secret: "",
        api_url: "",
      },
    },
  });

  const fetchSettingsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);

        return;
      }

      setSMPTSettingsData(data.data.settings.smtp);
      setTrestleSettingsData(data.data.settings.trestle);

      methods.reset({
        smtp: {
          from_address: data.data.settings.smtp?.from_address || "",
          host: data.data.settings.smtp?.host || "",
          port: data.data.settings.smtp?.port || "",
          username: data.data.settings.smtp?.username || "",
          password: data.data.settings.smtp?.password || "",
          encryption: data.data.settings.smtp?.encryption || "",
        },
        trestle: {
          client_id: data.data.settings.trestle?.client_id || "",
          client_secret: data.data.settings.trestle?.client_secret || "",
          api_url: data.data.settings.trestle?.api_url || "",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token, methods]);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  const onSubmit = async (formData) => {
    setSubmitLoading(true);

    try {
      const response = await fetch(`/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          smtp: formData.smtp,
          trestle: formData.trestle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);

        return;
      }

      toast.success(data.data.message || "Settings updated successfully");
      fetchSettingsData();
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <CollapsibleLayout
          title={"SMTP Settings"}
          component={
            <SMTPSettingForm loading={loading} data={SMPTSettingsData} />
          }
        />
        <CollapsibleLayout
          title={"Trestle Settings"}
          component={
            <TrestleSettingForm loading={loading} data={TrestleSettingsData} />
          }
        />
        <Box marginTop={"20px"}>
          <CustomButton
            loading={submitLoading}
            disabled={submitLoading || loading}
            width="25%"
            type="submit"
          >
            Update
          </CustomButton>
        </Box>
      </form>
    </FormProvider>
  );
};

export default Settings;
