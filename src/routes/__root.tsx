import { Outlet, createRootRoute } from "@tanstack/react-router";

import "../styles.css";
import { Header } from "#/components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main className="">
        <Outlet />
      </main>
    </>
  );
}
