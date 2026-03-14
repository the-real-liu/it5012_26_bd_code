import { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate, Menu, usePermissions } from "react-admin";
import EditIcon from '@mui/icons-material/Edit';

const MyMenu = () => {
  const { permissions, isLoading } = usePermissions();
  if (isLoading) return null;

  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItems />
      {permissions === "lecturer" && (
        <Menu.Item
          to="/assign_grades"
          primaryText="Assign Grades"
          leftIcon={<EditIcon />}
        />
      )}
    </Menu>
  );
};

export const Layout = ({ children }) => (
  <RALayout menu={MyMenu}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
