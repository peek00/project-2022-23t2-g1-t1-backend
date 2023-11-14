import React, { useState, useEffect } from "react";
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";
import CustomDropdown from "../components/common_utils/CustomDropdown";
import { Button } from "@material-tailwind/react";

import LogsTable from "../components/logging_utils/LogsTable";
import FilterButton from "../components/common_utils/FilterButton";
import CustomSearch from "../components/common_utils/CustomSearch";
import { queryLog, getAllLogGroups } from "@/apis/logging";
import DateTimeSelector from "../components/common_utils/DateTimeSelector";
import { setRef } from "@mui/material";

export default function LogsPage() {
  const pageLimit = 10; // Item Limit
  const preFetchLimit = 5; // Prefetch paegs
  const [offsetId, setOffsetId] = useState(null);
  const [logGroups, setLogGroups] = useState([]);
  const [selectedLogGroup, setSelectedLogGroup] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [userId, setUserId] = useState("");
  const [data, setData] = useState([]);
  const [endData, setEndData] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(0); // New state for page number
  const [lastRetrievedPage, setLastRetrievedPage] = useState(0);
  const [refreshSearch, setRefreshSearch] = useState(false); // New state for page number
  const [alert, setAlert] = useState(false);
  const [prefetchData, setPrefetchData] = useState({});
  const updatePrefetchData = (key, value) => {
    setPrefetchData((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
  };

  const [userId, setUserId] = useState('');
  const [defaultInput, setDefaultInput] = useState('');

  const handleSearchChange = (value) => {
    setUserId(value);
  };

  const handleResetDefaultInput = () => {
    setDefaultInput('');
  };

  useEffect(() => {
    makeQuery(0, preFetchLimit, null);
    setRefreshSearch(false);
  }, [refreshSearch]);

  const onSearch = async () => {
    // Reset
    setLastRetrievedPage(0);
    setLastPage(false);
    setEndData(false);
    setPageNumber(0);
    setPrefetchData({});


    if (!selectedLogGroup) {
      setAlert(true);
    }
    else {
      setAlert(false);
      setRefreshSearch(true);
    }
  }

  const onClear = async () => {
    // Reset
    setSelectedLogGroup(null);
    setStartTime("");
    setEndTime("");
    // resetUserId();  
    handleResetDefaultInput();
  }

  useEffect(() => {
    setData(prefetchData[pageNumber]);
  }, [pageNumber]);

  useEffect(() => {
    // Retrieve all loggroups
    getAllLogGroups()
      .then((data) => {
        setLogGroups(data);
      })
      .catch((error) => {
        //console.log(error);
      });
  }, []);


  // Uncomment this to check prefetch
  // useEffect(() => {
  //   //console.log(prefetchData);
  // }, [prefetchData]);
  // Below expects first load to be 0, 5
  const makeQuery = async (pageNumberToSave, remainingPages, offsetId) => {
    if (endData) {
      return;
    }
    // setIsLoading(true);
    if (remainingPages === 0) {
      // setIsLoading(false);
      setOffsetId(offsetId);
      return;
    }
    let reqParams = {
      logGroup: selectedLogGroup,
      limit: pageLimit,
      offsetId: offsetId,
      ...(startTime !== null && startTime !== undefined && { startTime }),
      ...(endTime !== null && endTime !== undefined && { endTime }),
      ...(userId !== null && userId !== undefined && { userId }),
    };
    try {
      const response = await queryLog(reqParams);
      const data = response.data;
      if (response.nextPageKey == null) {
        updatePrefetchData(pageNumberToSave, data); // Idk why man
        setLastRetrievedPage(lastRetrievedPage + 1);
        setEndData(true);
      } else {
        // Update the dictionary with the current page number
        const offsetId = response.nextPageKey;
        updatePrefetchData(pageNumberToSave, data);
        setLastRetrievedPage(lastRetrievedPage + 1);
        // Make a recursive call for the next page
        await makeQuery(pageNumberToSave + 1, remainingPages - 1, offsetId);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const goBack = () => {
    if (pageNumber != 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
      setLastPage(false);
    }
  };

  const goForward = async () => {
    // Stop from going
    if (
      !(pageNumber + 1 in prefetchData) ||
      prefetchData[pageNumber].length < pageLimit
    ) {
      setLastPage(true);
    } else {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      try {
        if (lastRetrievedPage - pageNumber <= 2) {
          await makeQuery(lastRetrievedPage + 1, preFetchLimit, offsetId);
        }
      } catch (error) {
        console.error("Error in goForward:", error);
      }
    }
  };

  // const resetUserId = () => {
  //   setUserId("");
  // };

  return (
    <div className="flex min-h-screen ">
      <SideBar />
      {/* <TopBar /> */}
      <div className="w-4/5 ms-[15%] ">
        <div className="fixed top-0 z-10 flex w-full p-4 bg-gray-200 ps-12">
          <CustomDropdown
            label="Log Group"
            id="log-group"
            options={logGroups}
            setSelected={setSelectedLogGroup}
          />
          <DateTimeSelector
            label="Start Time"
            id="start-time"
            datetime={startTime}
            setDatetime={setStartTime}
          />
          <DateTimeSelector
            label="End Time"
            id="end-time"
            datetime={endTime}
            setDatetime={setEndTime}
            minDateTime={startTime ? startTime : null}
          />
          <CustomSearch
            label="Search"
            placeholder="Type your search here"
            defaultInput={defaultInput}
            setSearch={handleSearchChange}
            resetDefaultInput={handleResetDefaultInput}
          />

          <button
            className="px-5 ms-4 ml-0  text-white bg-[#1C2434] rounded-md small-button h-9 mt-6"
            onClick={onSearch}
          >
            Search
          </button>
          <button
            className="px-5 mt-6 ml-0 text-white bg-red-800 rounded-md ms-4 small-button h-9"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
        <div className="mt-28 ms-10">
          {alert && (
            <div className="inline-block px-5 py-5 mb-5 text-red-800 bg-red-200 border border-red-800">
              Log group must be specified!
            </div>
          )}
          <p className="text-2xl font-thin">Showing logs for: <span className="font-bold blue-gray-500">{selectedLogGroup}</span>  </p>
        </div>
        <div className="mt-12">
          <LogsTable
            pageData={prefetchData[pageNumber]}
            pageNumber={pageNumber}
          />
        </div>
        {/* <div className="fixed top-0 z-10 flex w-full p-4 bg-gray-200 ps-12"> */}

        <div className="z-50 fixed mt-5 text-center left-[45%] ">
          <Button
            variant="outlined"
            size="sm"
            onClick={goBack}
            className={`me-5 ${pageNumber === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={pageNumber === 0}
          >
            Previous
          </Button>
          {pageNumber + 1}
          <Button
            variant="outlined"
            size="sm"
            onClick={goForward}
            className={`mx-5 ${lastPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={lastPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
