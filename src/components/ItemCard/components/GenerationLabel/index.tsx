export default function GenerationLabel({ num }: { num: number | string }) {
  return (
    <div className="bg-black bg-opacity-60 px-1 py-[1px] flex flex-row justify-center items-center rounded-sm w-fit">
      <div className="text-white text-xxs font-medium">{`GEN ${num}`}</div>
    </div>
  );
}
