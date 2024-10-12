import { data, Form, useFetcher } from "react-router";
import { getContact, updateContact, type ContactRecord } from "../data";
import type * as Route from "./+types.contact";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw data("Not Found", { status: 404 });
  }

  return { contact };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
          alt=""
        />
      </div>
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>
        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`} target="_blank">
              {contact.twitter}
            </a>
          </p>
        ) : null}
        {contact.notes ? <p>{contact.notes}</p> : null}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const shouldDelete = confirm(
                "Please confirm you want to delete this record.",
              );

              if (!shouldDelete) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
