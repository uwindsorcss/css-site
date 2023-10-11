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
    registrable: boolean;
    capacity?: number;
    location?: string;
    startDate: date;
    endDate: date;
  }

  interface PostFormData {
    title: string;
    isTeam: boolean | undefined;
    content: string;
  }

  interface SuggestionFormData {
    title: string;
    suggestion: string;
  }
}
