import OrderPage from "#/Pages/OrderPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderPage />;
}
