function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex flex-col items-center min-h-screen gap-10 px-4 md:px-8 py-32 max-w-7xl">
      {children}
    </div>
  );
}

export default PageLayout;
