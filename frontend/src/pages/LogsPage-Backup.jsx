import React, { useState, useEffect } from "react";
import SideBar from "../components/common_utils/SideBar";
import TopBar from "../components/common_utils/TopBar";
import CustomDropdown from "../components/common_utils/CustomDropdown";

import LogsTable from "../components/logging_utils/LogsTable";
import FilterButton from "../components/common_utils/FilterButton";
import CustomSearch from "../components/common_utils/CustomSearch";
import { queryLog, getAllLogGroups } from "@/apis/logging";
import DateTimeSelector from "../components/common_utils/DateTimeSelector";

export default function LogsPage() {
  const pageLimit = 10;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    prevPage: null,
    currentPage: 1,
    nextPage: null,
  });
  const [pageKeyLs, setPageKeyLs] = useState([]);
  const [offsetId, setOffsetId] = useState(null);
  const [logGroups, setLogGroups] = useState([]);
  const [selectedLogGroup, setSelectedLogGroup] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userId, setUserId] = useState("");
  const [pageNumber, setPageNumber] = useState(1); // New state for page number
  const [isLoading, setIsLoading] = useState(true);
  const [looped, setLooped] = useState(false);

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
      makeQuery();
      setIsLoading(false);
    }
  }, [selectedLogGroup, startTime, endTime, userId, offsetId]);

  useEffect(() => {
    // Reset Pagination
    setPageKeyLs([]);
    setOffsetId(null);
    setPagination({
      prevPage: null,
      currentPage: 1,
      nextPage: null,
    });
  }, [startTime, endTime, userId]);

  const makeQuery = async () => {
    setIsLoading(true);
    let reqParams = {
      logGroup: selectedLogGroup,
      limit: pageLimit,
    };
    if (startTime !== "") {
      reqParams.startTime = startTime;
    }
    if (endTime !== "") {
      reqParams.endTime = endTime;
    }
    if (userId !== "") {
      reqParams.userId = userId;
    }
    if (offsetId !== null) {
      reqParams.offsetId = offsetId;
    }
    queryLog(reqParams)
      .then((d) => {
        const data = d.data;
        const nextKey = d.nextPageKey;
        setData(data);
        setPagination((prev) => ({
          prevPage: prev.currentPage === 1 ? null : prev.currentPage - 1,
          currentPage: prev.currentPage,
          nextPage: nextKey,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const goBack = () => {
    if (pagination.prevPage !== null) {
      setPageKeyLs([...pageKeyLs, offsetId]);
      setOffsetId(pagination.prevPage);
      setPagination((prev) => ({
        prevPage: prev.prevPage === 1 ? null : prev.prevPage - 1,
        currentPage: prev.prevPage,
        nextPage: prev.currentPage,
      }));
      setPageNumber(pageNumber - 1); // Update the page number
    } else {
      setOffsetId(null);
      setPagination({
        prevPage: null,
        currentPage: 1,
        nextPage: pagination.currentPage + 1,
      });
      setPageNumber(1); // Reset the page number to 1
    }
  };

  const goForward = () => {
    if (pagination.nextPage !== null) {
      setPageKeyLs([...pageKeyLs, offsetId]);
      setOffsetId(pagination.nextPage);
      setPagination((prev) => ({
        prevPage: prev.currentPage,
        currentPage: prev.nextPage,
        nextPage: null,
      }));
      setPageNumber(pageNumber + 1); // Update the page number
      setLooped(false);
    } else {
      setOffsetId(null);
      setPagination({
        prevPage: pagination.currentPage,
        currentPage: pagination.nextPage || 1,
        nextPage: null,
      });
      setPageNumber(pagination.nextPage || 1); // Update the page number
      setLooped(true);
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
            pageData={data}
            prevPage={pagination.prevPage}
            nextPage={pagination.nextPage}
            goBack={goBack}
            goForward={goForward}
            pageNumber={pageNumber}
            />
          </>
        )}
      </div>
    </div>
  );
}
