import React from 'react';

export default function NavBar() {
  return (
    <div className="relative">
      <div className="position-relative">
        {/* Have to change the group */}
        <nav className="bg-transparent absolute top-0 left-0 w-full group  hover:bg-[#1C2434] z-10 group">
          <div className="flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" className="flex items-center">
              <img src="/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
            </a>
            <div className="flex md:order-2">
              <button
                type="button"
                className="text-white border-2 border-[#1C2434] rounded-md bg-transparent  font-medium  text-sm px-4 py-2 text-center mr-3 md:mr-0 group-hover:border-white "
              >
                Login
              </button>
              <button
                data-collapse-toggle="navbar-cta"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-cta"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}




