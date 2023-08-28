import PageWrapper from "@/components/PageWrapper";

interface pageProps {
  params: { events: string };
}

export default function Event({ params }: pageProps) {
  return (
    <PageWrapper>
      <h1 className="text-4xl text-center font-bold">{params.events}</h1>
    </PageWrapper>
  );
}
