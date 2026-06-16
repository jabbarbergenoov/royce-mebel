import DocumentPage from "#/Pages/DocumentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documents")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DocumentPage />;
}
