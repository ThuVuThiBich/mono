import { Grid } from 'antd';
import Desktop from './Desktop';
import Mobile from './Mobile';

const { useBreakpoint } = Grid;

const Header = () => {
  const screen = useBreakpoint();

  return (
    <>
      {screen.md ? <Desktop /> : <Mobile />}
    </>
  );
};

export default Header;
