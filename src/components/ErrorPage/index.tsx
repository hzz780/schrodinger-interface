const ErrorPage = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex gap-12 flex-col justify-center items-center">
        <div className="flex flex-col gap-2 text-center text-[#1a1a1a]">
          <div className="text-2xl leading-[34px] font-bold">Oops! An unexpected error occurred.</div>
          <div className="text-xl leading-[30px] font-medium">Please try again later.</div>
        </div>
      </div>
    </div>
  );
};
export default ErrorPage;
