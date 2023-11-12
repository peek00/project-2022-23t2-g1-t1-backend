import React, { useEffect, useState } from 'react';
import AvatarInfo from './AvatarInfo';
import AvatarText from '../common_utils/AvatarText';
import { useParams } from 'react-router-dom';
import axios from "axios";


export default function UpdatePointsTable(props) {
    const { companyId, userId } = useParams();
    const goBack = () => {
        window.history.back();
    };

    // State to keep track of the current value
    const [inputValue, setInputValue] = useState(1000);

    // Function to handle the button clicks for both addition and subtraction
    const handleButtonClick = (value) => {
        // Update the inputValue based on the button click
        setInputValue((prevValue) => prevValue + value);
    };

    const handleSubmit = () => {       

        // Make the Axios GET request
        console.log("sending")

        const formData = {
                            change: inputValue,
                            company_id: companyId,
                            user_id: userId
                        };
        // console.log(formData);
        // axios.post("http://localhost:3000/changeBalance", formData)
        // .then((response) => {
        //     console.log(response.data);
        //     window.alert("Points updated successfully");
        //     goBack();
        // })
        // .catch((error) => {
        //     console.log("failed");
        //     console.error('Error:', error);
        // });
        axios.post(API_BASE_URL+ '/api/points/changeBalance', formData, {withCredentials:true})
        .then((response) => {
            console.log(response.data);
            window.alert("Points updated successfully");
            goBack();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    return (
        <div className=" w-[80%]  text-center absolute top-[20%]">
            <img
                src="/arrow.png" // Replace with the actual image URL
                alt="Go Back"
                onClick={goBack}
                style={{ cursor: 'pointer' }} className='absolute  left-[15%] w-[2%]'
            />

            <form className='flex bg-[#F5F5F5] ms-[20%] mt-10 rounded-2xl '>
                <div>
                    <AvatarInfo userId={userId}/>
                </div>
                <div className='flex flex-col mt-[162px] ms-10 text-center'>
                    <div className='flex gap-4 text-center'>
                        <button type="button" onClick={() => handleButtonClick(-25)} className="text-black hover:bg-[#1C2434] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 " >-</button>
                        <input
                            type="text"
                            id="disabled-input"
                            aria-label="disabled input"
                            className="ps-[10px] rounded-3xl py-10 mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm text-center focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={inputValue}
                            disabled
                        />
                        <button type="button" onClick={() => handleButtonClick(25)} className="text-black hover:bg-[#1C2434] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 ">+</button>
                    </div>
                    <div className='flex gap-2 text-center mt-10 ms-10'>
                        <button type="button" onClick={() => handleButtonClick(-25)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">-25</button>
                        <button type="button" onClick={() => handleButtonClick(-50)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">-50</button>
                        <button type="button" onClick={() => handleButtonClick(-100)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">-100</button>
                    </div>
                    <div className='flex gap-2 text-center mt-10 ms-10'>
                        <button type="button" onClick={() => handleButtonClick(25)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+25</button>
                        <button type="button" onClick={() => handleButtonClick(50)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+50</button>
                        <button type="button" onClick={() => handleButtonClick(100)} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white bg-[#D9D9D9]">+100</button>
                    </div>
                    <button type="button" onClick={handleSubmit} className="focus:outline-none my-[20px] text-white font-medium bg-[#1C2434] hover:font-bold focus:ring-4 focus:ring-purple-300 rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Submit</button>
                </div>
            </form>
        </div>
    );
}
