import { data, Form, redirect } from "react-router";
import { getContact, updateContact } from "../data";
import type * as Route from "./+types.edit";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw data("Not Found", { status: 404 });
  }

  return { contact };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);

  return redirect(`/contacts/${params.contactId}`);
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          type="text"
          name="first"
          defaultValue={contact.first}
          placeholder="First"
          aria-label="First name"
        />
        <input
          type="text"
          name="last"
          defaultValue={contact.last}
          placeholder="Last"
          aria-label="Last name"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          defaultValue={contact.twitter}
          placeholder="@jack"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          type="url"
          name="avatar"
          defaultValue={contact.avatar}
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}
