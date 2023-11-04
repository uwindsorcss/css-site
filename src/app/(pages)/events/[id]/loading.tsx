function loading() {
  return (
    <div className="flex flex-col justify-center w-full gap-3 max-w-2xl mx-auto">
      <h1 className="w-[50%] h-8 skeleton" />
      <div className="w-[80%] h-5 skeleton" />
      <div className="w-[65%] h-5 skeleton" />
      <div className="w-full h-96 skeleton" />
    </div>
  );
}

export default loading;
