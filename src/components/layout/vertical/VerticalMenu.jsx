"use client";

import { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import PerfectScrollbar from "react-perfect-scrollbar";

import { Menu, MenuItem } from "@menu/vertical-menu";

import useVerticalNav from "@menu/hooks/useVerticalNav";

import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

import menuItemStyles from "@core/styles/vertical/menuItemStyles";

import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import useFilteredMenu from "@/hooks/useFilteredMenus";

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const filteredMenuData = useFilteredMenu();

  if (!isMounted) return null;

  const { isBreakpointReached, transitionDuration } = verticalNavOptions;
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <i className="tabler-circle text-xs" />,
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {filteredMenuData.map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            icon={<i className={item.icon} />}
          >
            {item.label}
          </MenuItem>
        ))}
        <MenuItem
          href={"/admin/properties"}
          icon={<i className={"tabler-building-store"} />}
        >
          Properties
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
