import { route, type RouteConfig } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  route("contacts/:contactId", "./routes/contact.tsx"),
  route("contacts/:contactId/edit", "./routes/edit.tsx"),
];
