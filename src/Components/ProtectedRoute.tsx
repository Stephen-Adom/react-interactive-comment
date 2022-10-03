import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

type ProtectedRouteType = {
  component: ReactElement;
};

const ProjectedRoute = ({ component }: ProtectedRouteType) => {
  const authUser = useAppSelector((state) => state.auth.authUser);

  return (
    <>{authUser && authUser.uid ? component : <Navigate to="/"></Navigate>}</>
  );
};

export default ProjectedRoute;
