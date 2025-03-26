"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import classnames from "classnames";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";

import { toast } from "react-toastify";

import Link from "@components/Link";
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";

import { setCredentials } from "@/redux-store/slices/authSlice";

import { LoginFormValidationSchema } from "@/utils/formValidations";
import CustomButton from "@/components/common/CustomButton";

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450,
  },
}));

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
});

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [loginApiError, setLoginApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Vars
  const darkImg = "/images/pages/auth-mask-dark.png";
  const lightImg = "/images/pages/auth-mask-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.png";

  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";

  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const router = useRouter();
  const { settings } = useSettings();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration,
  );

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginFormValidationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginApiError(result.message);

        return;
      }

      if (result.data?.token) {
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
            permissions: result.data.permissions,
          }),
        );

        setLoginApiError("");
        router.push("/admin/dashboard");
        toast.success("Successfully logged in!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bs-full justify-center">
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
          {
            "border-ie": settings.skin === "bordered",
          },
        )}
      >
        <LoginIllustration
          src={characterIllustration}
          alt="character-illustration"
        />
        {!hidden && (
          <MaskImg
            alt="mask"
            src={authBackground}
            className={classnames({
              "scale-x-[-1]": theme.direction === "rtl",
            })}
          />
        )}
      </div>
      <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
        <Link className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
          <Logo />
        </Link>
        <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0">
          <div className="flex flex-col gap-1">
            <Typography variant="h4">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>
              Please sign-in to your account and start the adventure
            </Typography>
          </div>
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <CustomTextField
              {...register("email")}
              autoFocus
              fullWidth
              label="Email or Username"
              placeholder="Enter your email or username"
              error={!!errors.email || !!loginApiError}
              helperText={errors.email?.message || loginApiError}
            />
            <CustomTextField
              {...register("password")}
              fullWidth
              label="Password"
              placeholder="············"
              id="outlined-adornment-password"
              type={isPasswordShown ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
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
              error={!!errors.password || !!loginApiError}
              helperText={errors.password?.message || loginApiError}
            />
            <div className="flex justify-between items-center gap-x-3 gap-y-1 flex-wrap">
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Typography
                className="text-end"
                color="primary"
                component={Link}
                href="/admin/forgot-password"
              >
                Forgot password?
              </Typography>
            </div>
            <CustomButton
              fullWidth={true}
              variant="contained"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Login
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
