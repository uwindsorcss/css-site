function loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col justify-center gap-3">
      <h1 className="skeleton h-8 w-[50%]" />
      <div className="skeleton h-5 w-[80%]" />
      <div className="skeleton h-5 w-[65%]" />
      <div className="skeleton h-96 w-full" />
    </div>
  );
}

export default loading;
