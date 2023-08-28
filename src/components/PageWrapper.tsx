function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gap-4">
      <div className="mx-auto flex flex-col items-center justify-center min-h-screen gap-10 px-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
