import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="px-5 container">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
