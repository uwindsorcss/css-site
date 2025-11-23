function ChipInput() {
  return (
    <input
      className="h-[40px] w-[50%] min-w-[150px] rounded-full bg-[#323234] px-5 transition-[height,width] duration-1000 ease-in-out focus:outline-none md:h-[40px] md:w-[clamp(450px,35%,600px)]"
      type="text"
      name="chip-input"
      id="chip-input"
      placeholder="Ask anything to chip"
    />
  );
}

export default ChipInput;
