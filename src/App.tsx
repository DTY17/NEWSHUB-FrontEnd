import { StoreProvider } from "./contexts/context";
import Router from "./routes/router";


function App() {
  
  return (
    <StoreProvider>
      <Router/>
    </StoreProvider>
  );
}

export default App;
