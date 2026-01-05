import { StoreProvider } from "./contexts/context";
import Router from "./routes/router";
import { store } from "../store/store";
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <StoreProvider>
        <Router />
      </StoreProvider>
    </Provider>
  );
}

export default App;
