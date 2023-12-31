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
          以太坊测试链 <div className="text-sm text-blue-500"><a href="https://github.com/binschoolapp/web3/tree/main/faucet" target="_blank">查看开源代码</a></div>
          </div>
          
        </div>
      </header>
  );
};

export default Header;