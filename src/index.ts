import nodeFetch from "node-fetch";
import { LoggerBuilder, chalk } from "@made-simple/logging";

import type {
    RequestInfo,
    RequestInit as NodeFetchRequestInit
} from "node-fetch";

export interface RequestInit extends Omit<NodeFetchRequestInit, "body"> {
    body?: Record<string, any> | string;
}

export class FetcherBuilder {
    protected logger = new LoggerBuilder("fetch", chalk.yellowBright);
    protected headers: Record<string, string> = {
        "Content-Type": "application/json",
        "accept": "application/json"
    }

    constructor(headers?: Record<string, string>, logger?: LoggerBuilder) {
        if (headers) this.headers = headers;
        if (logger) this.logger = logger;
    }

    /**
     * Fetch data from a URL and return it as JSON.
     * 
     * ```ts
     * fetcher.fetch("https://google.com/");
     * // Prints: Fetched https://google.com/ GET Status: 200 OK
     * 
     * fetcher.fetch("https://google.com/404")
     * // Throws: Failed to fetch https://google.com/404 GET Status: 404 Not Found
     * ```
     */
    async fetch<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        const headers = { ...this.headers, ...(init?.headers ?? {}) };
        if (init?.body && typeof init.body !== "string") {
            init.body = JSON.stringify(init.body);
        }

        const response = await nodeFetch(url, { ...init as NodeFetchRequestInit, headers });

        if (!response.ok) {
            this.logger.error("Failed to fetch %s %s Status: %s %s", chalk.bold(url), init?.method ?? "GET", response.status, response.statusText);
            throw new Error(response.statusText);
        }

        this.logger.debug("Fetched %s %s Status: %s %s", chalk.bold(url), init?.method ?? "GET", response.status, response.statusText);
        return await response.json() as T | null;
    }

    /**
     * Fetch data from a URL using the GET method.
     * Alias for `fetch(url, { method: "GET" })`.
     * 
     * ```ts
     * fetcher.get("https://google.com/");
     * // Prints: Fetched https://google.com/ GET Status: 200 OK
     * ```
     */
    async get<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        return await this.fetch(url, { ...init, method: "GET" });
    }

    /**
     * Fetch data from a URL using the POST method.
     * Alias for `fetch(url, { method: "POST" })`.
     * 
     * ```ts
     * fetcher.post("https://google.com/", { body: { key: "value" } });
     * // Prints: Fetched https://google.com/ POST Status: 200 OK
     * ```
     */
    async post<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        return await this.fetch(url, { ...init, method: "POST" });
    }

    /**
     * Fetch data from a URL using the PUT method.
     * Alias for `fetch(url, { method: "PUT" })`.
     * 
     * ```ts
     * fetcher.put("https://google.com/", { body: { key: "value" } });
     * // Prints: Fetched https://google.com/ PUT Status: 200 OK
     * ```
     */
    async put<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        return await this.fetch(url, { ...init, method: "PUT" });
    }

    /**
     * Fetch data from a URL using the PATCH method.
     * Alias for `fetch(url, { method: "PATCH" })`.
     * 
     * ```ts
     * fetcher.patch("https://google.com/", { body: { key: "value" } });
     * // Prints: Fetched https://google.com/ PATCH Status: 200 OK
     * ```
     */
    async patch<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        return await this.fetch(url, { ...init, method: "PATCH" });
    }

    /**
     * Fetch data from a URL using the DELETE method.
     * Alias for `fetch(url, { method: "DELETE" })`.
     * 
     * ```ts
     * fetcher.delete("https://google.com/");
     * // Prints: Fetched https://google.com/ DELETE Status: 200 OK
     * ```
     */
    async delete<T extends {} = any>(url: RequestInfo | string, init?: RequestInit): Promise<T | null> {
        return await this.fetch(url, { ...init, method: "DELETE" });
    }

    /**
     * Set the headers to be used in the fetch request.
     * These will be used and merged in every fetch request.
     * 
     * ```ts
     * fetcher.setHeaders({
     *     accept: "application/json"
     * });
     * ```
     */
    setHeaders(headers: Record<string, string>): void {
        this.headers = headers;
    }

    /**
     * Set the logger for the Fetcher.
     * 
     * ```ts
     * const logger = new LoggerBuilder("fetcher", chalk.yellowBright);
     * fetcher.setLogger(logger);
     * ```
     */
    setLogger(logger: LoggerBuilder): void {
        this.logger = logger;
    }
}

export default new FetcherBuilder();
