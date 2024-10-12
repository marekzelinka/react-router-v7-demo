import { redirect } from "react-router";
import { deleteContact } from "~/data";
import type * as Route from "./+types.contact";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);

  return redirect("/");
}
