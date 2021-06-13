import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClient } from './query';
import { GlobalStyles } from './resources/styles/Global.styled';
import Routes from './routes/Routes';

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Routes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);

export default App;
