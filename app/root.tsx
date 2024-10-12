import { useEffect } from "react";
import type { LinksFunction } from "react-router";
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useSubmit,
} from "react-router";
import type * as Route from "./+types.root";
import "./app.css";
import { createEmptyContact, getContacts } from "./data";
import ErrorPage from "./error-page";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { q, contacts } = loaderData;

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isSearching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  const showLoadingOverlay = isLoading && !isSearching;

  const submit = useSubmit();

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
          <Form
            id="search-form"
            role="search"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              type="search"
              name="q"
              id="q"
              defaultValue={q || ""}
              className={isSearching ? "loading" : ""}
              placeholder="Search"
              aria-label="Search contacts"
            />
            <div id="search-spinner" aria-hidden hidden={!isSearching} />
          </Form>
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
                      isActive ? "active" : isPending ? "pending" : ""
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
      <div id="detail" className={showLoadingOverlay ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}
