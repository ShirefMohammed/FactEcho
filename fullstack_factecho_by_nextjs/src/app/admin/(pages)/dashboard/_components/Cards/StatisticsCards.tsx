"use client";

import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { authorsAPIs } from "@/axios/apis/authorsAPIs";
import { categoriesAPIs } from "@/axios/apis/categoriesAPIs";
import { usersAPIs } from "@/axios/apis/usersAPIs";
import {
  ApiBodyResponse,
  GetTotalArticlesCountResponse,
  GetTotalAuthorsCountResponse,
  GetTotalCategoriesCountResponse,
  GetTotalUsersCountResponse,
} from "@/types/apiTypes";
import { useEffect, useState } from "react";

import CardDataStats from "./CardDataStats";

const StatisticsCards = () => {
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalAuthorsCount, setTotalAuthorsCount] = useState(0);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);

  const fetchTotalUsers = async () => {
    try {
      const resBody: ApiBodyResponse<GetTotalUsersCountResponse> =
        await usersAPIs.getTotalUsersCount();
      setTotalUsersCount(resBody.data!.totalUsersCount);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalAuthors = async () => {
    try {
      const resBody: ApiBodyResponse<GetTotalAuthorsCountResponse> =
        await authorsAPIs.getTotalAuthorsCount();
      setTotalAuthorsCount(resBody.data!.totalAuthorsCount);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalCategories = async () => {
    try {
      const resBody: ApiBodyResponse<GetTotalCategoriesCountResponse> =
        await categoriesAPIs.getTotalCategoriesCount();
      setTotalCategoriesCount(resBody.data!.totalCategoriesCount);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalArticles = async () => {
    try {
      const resBody: ApiBodyResponse<GetTotalArticlesCountResponse> =
        await articlesAPIs.getTotalArticlesCount();
      setTotalArticlesCount(resBody.data!.totalArticlesCount);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalAuthors();
    fetchTotalCategories();
    fetchTotalArticles();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats title="Total Users" total={String(totalUsersCount)} rate="0.43%" levelUp>
        <svg
          className="fill-primary dark:fill-white"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1C10.6569 1 12 2.34315 12 4C12 5.65685 10.6569 7 9 7C7.34315 7 6 5.65685 6 4C6 2.34315 7.34315 1 9 1ZM9 0C7.34315 0 6 1.34315 6 3C6 4.65685 7.34315 6 9 6C10.6569 6 12 4.65685 12 3C12 1.34315 10.6569 0 9 0ZM13 10H5C2.79086 10 1 11.7909 1 14V16H17V14C17 11.7909 15.2091 10 13 10ZM9 8C10.933 8 12.5 9.567 12.5 11.5C12.5 12.177 12.027 12.75 11.5 12.75H6.5C5.973 12.75 5.5 12.177 5.5 11.5C5.5 9.567 7.067 8 9 8Z"
            fill=""
          />
        </svg>
      </CardDataStats>
      <CardDataStats title="Total Authors" total={String(totalAuthorsCount)} rate="4.35%" levelUp>
        <svg
          className="fill-primary dark:fill-white"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10H16C16 7.79 14.21 6 12 6ZM12 12C11.45 12 11 12.45 11 13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13C13 12.45 12.55 12 12 12ZM10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16H10Z"
            fill=""
          />
        </svg>
      </CardDataStats>
      <CardDataStats
        title="Total Categories"
        total={String(totalCategoriesCount)}
        rate="2.59%"
        levelUp
      >
        <svg
          className="fill-primary dark:fill-white"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 1H5V3H3V1ZM3 4H5V6H3V4ZM3 7H5V9H3V7ZM3 10H5V12H3V10ZM3 13H5V15H3V13ZM6 1H8V3H6V1ZM6 4H8V6H6V4ZM6 7H8V9H6V7ZM6 10H8V12H6V10ZM6 13H8V15H6V13ZM9 1H11V3H9V1ZM9 4H11V6H9V4ZM9 7H11V9H9V7ZM9 10H11V12H9V10ZM9 13H11V15H9V13ZM12 1H14V3H12V1ZM12 4H14V6H12V4ZM12 7H14V9H12V7ZM12 10H14V12H12V10ZM12 13H14V15H12V13ZM15 1H17V3H15V1ZM15 4H17V6H15V4ZM15 7H17V9H15V7ZM15 10H17V12H15V10ZM15 13H17V15H15V13Z"
            fill=""
          />
        </svg>
      </CardDataStats>
      <CardDataStats
        title="Total Articles"
        total={String(totalArticlesCount)}
        rate="0.95%"
        levelDown
      >
        <svg
          className="fill-primary dark:fill-white"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 1H15C15.5523 1 16 1.44772 16 2V16C16 16.5523 15.5523 17 15 17H3C2.44772 17 2 16.5523 2 16V2C2 1.44772 2.44772 1 3 1ZM3 3V16H15V3H3ZM5 5H13V7H5V5ZM5 9H9V11H5V9ZM5 13H7V15H5V13ZM11 9H13V15H11V9Z"
            fill=""
          />
        </svg>
      </CardDataStats>
    </div>
  );
};

export default StatisticsCards;
