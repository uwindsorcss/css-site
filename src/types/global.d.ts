export {};

declare global {
  interface Link {
    name: string;
    href: string;
    description?: string;
    sublinks?: Link[];
  }

  interface EventFormData {
    title: string;
    description: string;
    location?: string;
    startDate: date;
    endDate: date;
  }
}
