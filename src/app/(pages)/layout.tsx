function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-10 px-4 py-28 md:px-8 md:py-32">
      {children}
    </div>
  );
}

export default PageLayout;
