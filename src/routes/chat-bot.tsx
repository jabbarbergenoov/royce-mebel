import ChatBotPage from "#/Pages/ChatBotPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat-bot")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatBotPage />;
}
