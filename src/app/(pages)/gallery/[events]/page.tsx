interface pageProps {
  params: { events: string };
}

export default function Event({ params }: pageProps) {
  return (
    <>
      <h1 className="text-center text-4xl font-bold">{params.events}</h1>
    </>
  );
}
