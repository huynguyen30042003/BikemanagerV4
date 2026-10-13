import { ReactNode } from "react";

interface AuthLayoutProp {
  children: ReactNode;
}

const AuthLayout = ({
  children,
}: AuthLayoutProp) => {
  return (
    <div className="flex flex-col items-center">
      <div className="px-5 h-screen flex flex-col items-center justify-center   container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;