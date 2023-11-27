const Footer = () => {
  return (
    <div className='flex flex-row h-[60px] text-sm leading-[60px] shadow-md text-center text-[#665555]' >
      <div className="flex-1"></div>
      <div className="flex-none mt-[15px] px-[10px]"><img src="/images/bst.png" className="w-[100px]"/></div>
      <div className="flex-1 flex-grow truncate">
        Ylem 测试链由南京百市通公司提供，仅用于 Web3 学习。
      </div>
      <div className="flex-1"></div>
    </div>
  );
};

export default Footer;