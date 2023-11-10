import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios

import RequestTemplate from "./RequestTemplate";
import {API_BASE_URL} from "@/config/config";

function CreateRequest() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const role = JSON.parse(localStorage.getItem("role"));

    const fetchData = async () => {
        try {
            const company = localStorage.getItem("selectedCompany");
            if (company) {
                setSelectedCompany(company);
            }
            let url = API_BASE_URL+`/api/maker-checker/templates/allowed_requestors?role=${role}`;
            const response = await axios.get(url, {
                withCredentials: true,
            });
            setTemplates(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleButtonClick = (index, data) => {
        console.log(data)
        setSelectedTemplate(data);
        setIsOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle create request form submit
    const handleFormSubmit = (formData) => {
        // TODO Form validation here
        console.log("Form data: ", formData);
        const url = API_BASE_URL+"/api/maker-checker/approval/create";
        axios
            .post(url, formData, {
                withCredentials: true,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    return (
        <div>
            <div className="relative inline-block text-left bg-slate-600">
                {/* Button */}
                <button
                    onClick={toggleDropdown}
                    className="px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                     {selectedTemplate == null ? "Select an action." : selectedTemplate.type}
                </button>
                {isOpen && (
                    <div className="right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {templates.map((data, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleButtonClick(index, data)}
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                >
                                    {data.type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            {selectedTemplate != null && (
                <RequestTemplate 
                    requestDetail={selectedTemplate} 
                    onSubmit={ handleFormSubmit} 
                    selectedCompany={selectedCompany}/>
            )}
        </div>
    );
}

export default CreateRequest;
