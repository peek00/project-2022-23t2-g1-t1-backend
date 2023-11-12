import React, {useState} from 'react';
export default function CustomSearch({label, placeholder,defaultInput, setSearch, resetDefaultInput}){
    const [input, setInput] = useState(null);
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex">
                <input
                    type="text"
                    placeholder={placeholder}
                    defaultValue={defaultInput}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-3 py-2 mt-1 mr-5 text-sm border border-gray-300 rounded-md"
                />
                {/* <button
                    className="px-3 py-2 mx-5 ml-0 text-white bg-blue-500 rounded-md"
                    onClick={() => setSearch(input)}
                >
                    Search
                </button>
                <button
                    className="px-3 py-2 mx-5 ml-0 text-white bg-red-500 rounded-md"
                    onClick={() => {
                        resetDefaultInput();
                        setSearch(null);
                    }}
                >
                    Clear
                </button> */}
            </div>
        </div>
    )
}