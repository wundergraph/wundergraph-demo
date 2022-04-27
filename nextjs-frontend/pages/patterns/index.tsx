import NextLink from "next/link";

interface PageInfo {
    title: string;
    slug: string;
}

const pages: PageInfo[] = [
    {
        title: "Client-Side User",
        slug: "client-side-user",
    },
    {
        title: "Server-Side User",
        slug: "server-side-user",
    },
    {
        title: "Universal User",
        slug: "universal-user",
    },
    {
        title: "Refetch User on Window Focus",
        slug: "refetch-user-on-window-focus",
    },
    {
        title: "Client-Side Query",
        slug: "client-side-query",
    },
    {
        title: "Server-Side Query",
        slug: "server-side-query",
    },
    {
        title: "Refetch Query on Window Focus",
        slug: "refetch-query-on-window-focus",
    },
    {
        title: "Lazy Query",
        slug: "lazy-query",
    },
    {
        title: "Debounce Query",
        slug: "debounce-query",
    },
    {
        title: "Server-Side Protected Query",
        slug: "server-side-protected-query",
    },
    {
        title: "Client-Side Protected Query",
        slug: "client-side-protected-query",
    },
    {
        title: "Universal Protected Query",
        slug: "universal-protected-query",
    },
    {
        title: "Unprotected Mutation",
        slug: "unprotected-mutation",
    },
    {
        title: "Protected Mutation",
        slug: "protected-mutation",
    },
    {
        title: "Refetch Mounted Operations on Mutation Success",
        slug: "refetch-mounted-operations-on-mutation-success",
    },
    {
        title: "Client-Side Subscription",
        slug: "client-side-subscription",
    },
    {
      title: "Stop Subscription on Window Blur",
      slug: "stop-subscription-on-window-blur",
    },
    {
        title: "Universal Subscription",
        slug: "universal-subscription",
    }
];

const Patterns = () => {
    return (
        <div>
            <h1>NextJS Universal Data Fetching Patterns</h1>
            <ol>
                {pages.map(page => (
                    <li key={page.slug}>
                        <NextLink href={`/patterns/${page.slug}`}>
                            <a>{page.title}</a>
                        </NextLink>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default Patterns;