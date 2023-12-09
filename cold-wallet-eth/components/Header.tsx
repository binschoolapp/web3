const Header = () => {
  return (
      <header className="relative bg-white shadow-sm min-w-[260px]">
        <div className="flex flex-row items-center h-[60px]">
          <a href="https://binschool.app">
            <div
              className="absolute left-0 top-0 bg-no-repeat bg-left-top bg-cover ml-[20px] mt-[10px] w-[160px] h-[35px] hidden sm:block"
              style={{ backgroundImage: "url(/images/logo.png)" }}
            ></div>
          </a>
          <div className="flex-1 text-center text-2xl overflow-hidden whitespace-nowrap text-highlight">
          ETH冷钱包生成器
          </div>
        </div>
      </header>
  );
};

export default Header;