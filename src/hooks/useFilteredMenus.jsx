import { useSelector } from "react-redux";

const useFilteredMenu = () => {
  const userPermissions = useSelector((state) => state.auth.permissions);

  if (!userPermissions) return [];

  const availablePermissions = Object.values(userPermissions ?? {});

  const menuData = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "tabler-smart-home",
      permission: "dashboard",
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: "tabler-users-group",
      permission: "users",
    },
    {
      label: "Roles",
      href: "/admin/roles",
      icon: "tabler-user-cog",
      permission: "roles",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "tabler-settings",
      permission: "settings",
    },
  ];

  return menuData.filter((item) =>
    availablePermissions.includes(item.permission),
  );
};

export default useFilteredMenu;
