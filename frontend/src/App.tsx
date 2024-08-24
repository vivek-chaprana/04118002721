import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavbarCmp from "./components/navbar";
import { ProductDetailsPage, ProductsPage } from "./pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProductsPage />,
    },
    {
      path: "/:productId",
      element: <ProductDetailsPage />,
    },
  ]);

  return (
    <>
      <NavbarCmp />
      <main className="bg-neutral-200 min-h-dvh">
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
