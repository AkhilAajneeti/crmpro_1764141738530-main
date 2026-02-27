const RoleGuard = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem("user");

  console.log("Stored User:", storedUser);

  if (!storedUser) return null;

  const user = JSON.parse(storedUser);
  console.log("Parsed User:", user);

  const role = user?.type;
  console.log("User Role:", role);
  console.log("Allowed Roles:", allowedRoles);

  if (!role || !allowedRoles.includes(role)) return null;

  return children;
};
export default RoleGuard;