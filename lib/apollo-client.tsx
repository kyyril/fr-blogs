"use client";

import { ReactNode, useMemo } from "react";
import {
    ApolloClient,
    ApolloProvider as BaseApolloProvider,
    InMemoryCache,
    HttpLink,
    from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { config } from "@/constants/config";

// Create Apollo Client
function makeClient() {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
                console.error(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );
            });
        }
        if (networkError) {
            console.error(`[Network error]: ${networkError}`);
        }
    });

    const httpLink = new HttpLink({
        uri: `${config.apiBaseUrl}/graphql`,
        credentials: "include",
    });

    return new ApolloClient({
        link: from([errorLink, httpLink]),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        blogs: {
                            keyArgs: [],
                            merge(existing, incoming, { args }) {
                                if (!args?.page || args.page === 1) {
                                    return incoming;
                                }
                                return {
                                    ...incoming,
                                    blogs: [...(existing?.blogs || []), ...incoming.blogs],
                                };
                            },
                        },
                    },
                },
            },
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network",
            },
            query: {
                fetchPolicy: "cache-first",
            },
        },
    });
}

// Singleton on client side
let apolloClientSingleton: ApolloClient<unknown> | undefined;

export function getApolloClient() {
    if (typeof window === "undefined") {
        return makeClient();
    }
    if (!apolloClientSingleton) {
        apolloClientSingleton = makeClient();
    }
    return apolloClientSingleton;
}

// Export singleton client
export const apolloClient = typeof window !== "undefined" ? getApolloClient() : makeClient();

// Apollo Provider wrapper component (Apollo Client 3.x compatible)
export function ApolloProvider({ children }: { children: ReactNode }) {
    const client = useMemo(() => getApolloClient(), []);

    return (
        <BaseApolloProvider client={client}>
            {children}
        </BaseApolloProvider>
    );
}
