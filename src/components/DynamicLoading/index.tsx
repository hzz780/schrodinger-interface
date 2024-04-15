import Loading from 'components/Loading';

export const DynamicLoading = () => {
  return (
    <div className="z-[100000] bg-fillMask1 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
      <div className=" w-[240px] h-[106px] flex flex-col justify-center items-center bg-white rounded-[8px]">
        <Loading />
        <span className="mt-[12px] text-[#1A1A1A] text-[14px] leading-[20px] font-normal text-center">loading...</span>
      </div>
    </div>
  );
};
