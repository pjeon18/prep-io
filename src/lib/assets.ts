/** Base-path-safe public URLs (GitHub Pages serves under /<repo>/). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");
