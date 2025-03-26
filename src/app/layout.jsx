// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css";

// Style Imports
import "@/app/globals.css";

// Generated Icon CSS Imports
import ClientToast from "@/components/common/ClientToast";
import "@assets/iconify-icons/generated-icons.css";

export const metadata = {
  title: "Welcome to Gromadzki Real Estate Admin Dashboard",
  description: "Gromadzki Real Estate Admin Dashboard",
};

const RootLayout = ({ children }) => {
  // Vars
  const direction = "ltr";

  return (
    <html id="__next" lang="en" dir={direction}>
      <body className="flex is-full min-bs-full flex-auto flex-col">
        <main>{children}</main>
        <ClientToast />
      </body>
    </html>
  );
};

export default RootLayout;
