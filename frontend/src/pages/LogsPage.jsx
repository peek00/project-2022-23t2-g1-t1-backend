
import React, { useState,useEffect } from "react";
import SideBar from '../components/common_utils/SideBar';
import TopBar from '../components/common_utils/TopBar';
import CustomDropdown from '../components/common_utils/CustomDropdown';

import LogsTable from '../components/logging_utils/LogsTable';
import FilterButton from '../components/common_utils/FilterButton';
import CustomSearch from '../components/common_utils/CustomSearch';
import {queryLog, getAllLogGroups} from "@/apis/logging";
import DateTimeSelector from "../components/common_utils/DateTimeSelector";

export default function LogsPage(){
  const pageLimit = 10;
  const [data,setData] = useState([]);
  const [prevPage,setPrevPage] = useState(null);
  const [nextPage,setNextPage] = useState(null);
  const [pageKeyLs,setPageKeyLs] = useState([]);
  const [offsetId,setOffsetId] = useState(null);
  const [logGroups,setLogGroups] = useState([]);
  const [selectedLogGroup,setSelectedLogGroup] = useState(null);
  const [startTime,setStartTime] = useState('');
  const [endTime,setEndTime] = useState('');
  const [userId,setUserId] = useState('');
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve all loggroups
    getAllLogGroups().then((data) => {
      setLogGroups(data);
    }).catch((error) => {
      console.log(error);
    });
  },[])

  useEffect(() => {
    // Retrieve logs
    if (selectedLogGroup !== null) {
      makeQuery();
      setIsLoading(false);
    }
  },[selectedLogGroup,startTime,endTime,userId,offsetId])

  useEffect(() => {
    // Reset Pagination
    setPageKeyLs([]);
    setPrevPage(null);
    setNextPage(null);
    setOffsetId(null);
  },[startTime,endTime,userId])

  const makeQuery = async () => {
    setIsLoading(true);
    let reqParams = {
      logGroup: selectedLogGroup,
      limit: pageLimit,
    }
    if (startTime !== '') {
      reqParams.startTime = startTime;
    }
    if (endTime !== '') {
      reqParams.endTime = endTime;
    }
    if (userId !== '') {
      reqParams.userId = userId;
    }
    if (offsetId !== null) {
      reqParams.offsetId = offsetId;
    }
    queryLog(reqParams).then((d) => {
      const data = d.data;
      const nextKey = d.nextPageKey;
      setData(data);
      setPrevPage(nextPage);
      setPageKeyLs([...pageKeyLs, nextPage]);
      setNextPage(nextKey);
    }).catch((error) => {
      console.log(error);
    });
  }

  const goBack = () => {
    if (prevPage !== null) {
      let newPageKeyLs = [...pageKeyLs];
      let newNextPage = newPageKeyLs.pop();
      setPageKeyLs(newPageKeyLs);
      setNextPage(newNextPage);
      setOffsetId(newNextPage);
    } else {
      setOffsetId(null);
      setNextPage(null);
    }
  }

  const goForward = () => {
    if (nextPage !== null) {
      setPageKeyLs([...pageKeyLs, nextPage]);
      setPrevPage(nextPage);
      setOffsetId(nextPage);
    } else {
      setOffsetId(null);
    }
  }

  const resetUserId = () => {
    setUserId('');
  }


  return(
    <div className='min-h-screen min-w-full'>
      <div className='container relative min-w-full min-h-screen'>
        <div className='w-[80%] relative min-h-full'>
          <TopBar/>
          <div className='absolute left-[25%] w-full'>
            <div className='min-h-screen'>
            </div>
            <div className='min-w-full fixed top-[10%] mb-10'>
              <div className='flex justify-around'>
            <CustomDropdown label='Log Group' id='log-group' options={logGroups} setSelected={setSelectedLogGroup}/>
            <DateTimeSelector label='Start Time' id='start-time' datetime={startTime} setDatetime={setStartTime} />
            <DateTimeSelector label='End Time' id='end-time' datetime={endTime} setDatetime={setEndTime} minDateTime={startTime ? startTime : null}/>
            <CustomSearch label='User ID' id='user-id' placeholder='Search By UserID' defaultInput={userId} setSearch={setUserId} resetDefaultInput={resetUserId} />
            <div className='w-1/4'></div>
            </div>
              <div className='flex justify-center'>
                <div className='w-[90%]'>
                  {
                    isLoading ? <div className='flex justify-center'><div className='loader'></div></div> : 
                    <LogsTable pageData={data} prevPage={prevPage} nextPage={nextPage} goBack={goBack} goForward={goForward} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='min-h-screen w-[20%] bg-[#1C2434]'>
          <SideBar/>
        </div>
      </div>
    </div>
  )

}