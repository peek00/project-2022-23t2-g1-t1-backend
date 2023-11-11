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

export default function LogsPage() {
  const pageLimit = 5;
  const preFetchLimit = 5;
  const [offsetId, setOffsetId] = useState(null);
  const [logGroups, setLogGroups] = useState([]);
  const [selectedLogGroup, setSelectedLogGroup] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [looped, setLooped] = useState(false);
  const [data, setData] = useState([]);
  const [endData, setEndData] = useState(false);
  
  const [yourDictionary, setYourDictionary] = useState({});
  const updateDictionaryValue = (key, value) => {
    // console.log("Saving data to page number " + key + " " + value.length)
    setYourDictionary((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
  };
  const [pageNumber, setPageNumber] = useState(0); // New state for page number
  const [lastRetrievedPage, setLastRetrievedPage] = useState(0);
  
  useEffect(() => {
    console.log(yourDictionary)
    setData(yourDictionary[pageNumber]);
    console.log("Data set for page " + pageNumber + " " + yourDictionary[pageNumber])
  }, [pageNumber, yourDictionary]);

  useEffect(() => {
    // Retrieve all loggroups
    getAllLogGroups()
      .then((data) => {
        setLogGroups(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // Retrieve logs
    if (selectedLogGroup !== null) {
      makeQuery(lastRetrievedPage, preFetchLimit, null);
      setIsLoading(false);
    }
  }, [selectedLogGroup]);

  useEffect(() => {
    console.log("Checking prefetch of " + pageNumber + " " + preFetchLimit)
    console.log(yourDictionary)
  },[yourDictionary]);

  // useEffect(() => {
  //     console.log("Set data to " + pageNumber + " " + yourDictionary[pageNumber])
  //     setData(yourDictionary[pageNumber]);
  // }, [pageNumber]);
  
  // Below expects first load to be 0, 5
  const makeQuery = async (pageNumberToSave, remainingPages, offsetId) => {
    if (endData) {
      return
    }
    // setIsLoading(true);
    console.log(pageNumberToSave)
    if (remainingPages === 0) {
      setIsLoading(false);
      setOffsetId(offsetId);
      return;
    }
    let reqParams = {
      logGroup: selectedLogGroup,
      limit: pageLimit,
      offsetId: offsetId,
    };
  
    try {
      const response = await queryLog(reqParams);
      const data = response.data;
      // console.log("Should start at 0 " + pageNumberToSave)
      if  (response.nextPageKey == null) {
        // console.log(" End of the line bud")
        updateDictionaryValue(pageNumberToSave, data);
        setLastRetrievedPage((prevPage) => prevPage + 1);
        setEndData(true);
      } else {
        // Update the dictionary with the current page number
        const offsetId = response.nextPageKey;
        updateDictionaryValue(pageNumberToSave, data);
        setLastRetrievedPage((prevPage) => prevPage + 1);
        // Make a recursive call for the next page
        await makeQuery(pageNumberToSave + 1, remainingPages - 1, offsetId);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  const goBack = () => {
    if (pageNumber != 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const goForward = async () => {
    // Stop from going
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    try {
      
      if (lastRetrievedPage - pageNumber <= 2) {
        await makeQuery(nextPage + 1, preFetchLimit, offsetId)
      }
    } catch (error) {
      console.error("Error in goForward:", error);
    }
  };
  


  const resetUserId = () => {
    setUserId("");
  };

  return (
    <div className="flex min-h-screen ">
        <SideBar />
        {/* <TopBar /> */}
      <div className="w-4/5 ms-[20%]">
        <div className="flex justify-start mt-24 mb-6 ms-10">
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
            label="User ID"
            id="user-id"
            placeholder="Search By UserID"
            defaultInput={userId}
            setSearch={setUserId}
            resetDefaultInput={resetUserId}
          />
          {pageNumber}
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <>
          {looped && (
            <div className="inline-block px-5 py-5 mb-5 text-green-800 bg-green-200 border border-green-800 ms-10">
              You&apos;ve looped back to the first page!
            </div>

          )}
          
          <LogsTable
            pageData={yourDictionary[pageNumber]}
            pageNumber={pageNumber}
            />
          </>
        )}
        <Button
          variant="outlined"
          size="sm"
          onClick={goBack}
          className={pageNumber === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          disabled={pageNumber === 0}
        >
          Previous
        </Button>
        {pageNumber}
        <Button variant="outlined" size="sm" onClick={goForward}>
          Next
        </Button>
      </div>
    </div>
  );
}
