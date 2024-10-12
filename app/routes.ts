import { index, route, type RouteConfig } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  index("./routes/home.tsx"),
  route("contacts/:contactId", "./routes/contact.tsx"),
  route("contacts/:contactId/edit", "./routes/edit.tsx"),
  route("contacts/:contactId/destroy", "./routes/destroy.tsx"),
];
