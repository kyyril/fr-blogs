"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * ⚡ PERFORMANCE: Hook for instant navigation with prefetching
 * Uses Next.js router with startTransition for non-blocking navigation
 */
export function useInstantNavigation() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const navigate = useCallback(
        (href: string) => {
            startTransition(() => {
                router.push(href);
            });
        },
        [router]
    );

    const prefetch = useCallback(
        (href: string) => {
            router.prefetch(href);
        },
        [router]
    );

    return {
        navigate,
        prefetch,
        isPending,
    };
}

/**
 * ⚡ PERFORMANCE: Debounce function for search inputs
 */
export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    let timeoutId: NodeJS.Timeout;

    return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    }) as T;
}

/**
 * ⚡ PERFORMANCE: Intersection Observer hook for lazy loading
 */
import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options, hasIntersected]);

    return { ref, isIntersecting, hasIntersected };
}
