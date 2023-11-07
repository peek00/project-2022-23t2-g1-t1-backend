import React, { useState, useEffect } from 'react';
import axios from "axios"; // Import Axios

function CreateRequest() {
    // Start: Listener for local storage
    const [selectedCompany, setSelectedCompany] = useState("");
    useEffect(() => {
        const storedCompany = localStorage.getItem("selectedCompany");
        if (storedCompany) {
            setSelectedCompany(storedCompany);
        }
    }, []);
    window.addEventListener('storage', () => {
        setSelectedCompany(localStorage.getItem('selectedCompany'));
    })
    // End: Listener for local storage
    useEffect(() => {
        const fetchData = async () => {
            let url = "http://localhost:8000/api/maker-checker/templates/?companyid=" + selectedCompany;
            try {
                console.log(url);
                const response = await axios.get(url, {
                    withCredentials: true,
                });
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, [selectedCompany]);
  

    return (
        <div className="relative inline-block text-left bg-slate-600">
            HI
        </div>
    );
}

export default CreateRequest;
