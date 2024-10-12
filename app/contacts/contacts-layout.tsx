import { useEffect } from "react";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router";
import { createEmptyContact, getContacts } from "~/data";
import ErrorPage from "~/error-page";
import type * as Route from "./+types.contacts-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await getContacts(q);

  return { q, contacts };
}

export async function action() {
  const contact = await createEmptyContact();

  return redirect(`/contacts/${contact.id}/edit`);
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { q, contacts } = loaderData;

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isSearching = new URLSearchParams(navigation.location?.search).has("q");
  const showLoadingOverlay = isLoading && !isSearching;

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>Remix Contacts</h1>
        <div>
          <SearchBar query={q ?? ""} />
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : undefined
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={showLoadingOverlay ? "loading" : undefined}>
        <Outlet />
      </div>
    </>
  );
}

function SearchBar({ query }: { query?: string }) {
  const submit = useSubmit();

  const navigation = useNavigation();
  const isSearching = new URLSearchParams(navigation.location?.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = query || "";
    }
  }, [query]);

  return (
    <Form
      role="search"
      id="search-form"
      onChange={(event) => {
        const isFirstSearch = query === undefined;
        submit(event.currentTarget, {
          replace: !isFirstSearch,
        });
      }}
    >
      <input
        type="search"
        name="q"
        id="q"
        defaultValue={query ?? ""}
        className={isSearching ? "loading" : ""}
        placeholder="Search"
        aria-label="Search contacts"
      />
      <div id="search-spinner" aria-hidden hidden={!isSearching} />
    </Form>
  );
}
