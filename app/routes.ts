import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export const routes: RouteConfig = [
  layout("./contacts/contacts-layout.tsx", [
    index("./contacts/home.tsx"),
    layout("./contacts/contacts-details-layout.tsx", [
      ...prefix("contacts", [
        route(":contactId", "./contacts/contact.tsx"),
        route(":contactId/edit", "./contacts/edit-contact.tsx"),
        route(":contactId/destroy", "./contacts/delete-contact.tsx"),
      ]),
    ]),
  ]),
];
