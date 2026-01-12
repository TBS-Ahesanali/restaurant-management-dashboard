import { Outlet } from 'react-router-dom';

const UnauthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UnauthLayout;
