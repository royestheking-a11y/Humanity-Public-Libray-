import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { LangProvider } from "./context/LangContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <LangProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </LangProvider>
  );
}
