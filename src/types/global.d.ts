export {};

declare global {
  interface Link {
    name: string;
    href: string;
    description?: string;
    sublinks?: Link[];
  }
}
