import MobileContext from '@sb-ui/contexts/MobileContext';
import useMobile from '@sb-ui/hooks/useMobile';
import Routes from '@sb-ui/routes/Routes';
import { GlobalStyles } from '@sb-ui/resources/styles/Global.styled';

const App = () => {
  const isMobile = useMobile();

  return (
    <MobileContext.Provider value={isMobile}>
      <GlobalStyles />
      <Routes />
    </MobileContext.Provider>
  )
}

export default App;
