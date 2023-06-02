import AutoAwesomeMotionSharpIcon from "@mui/icons-material/AutoAwesomeMotionSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

export const adminSideBarArray = [
  {
    title: "Manage Users",
    key: "um",
    path: "/user-management",
    icon: <GroupSharpIcon />,
  },
];

export const testerSideBarArray = [
  {
    title: "Dashboard",
    key: "project1",
    path: "/dashboard",
    icon: <AutoAwesomeMotionSharpIcon />,
  },
];

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  else return null;
};

export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};

export const setUserSession = (token, user) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const removeUserSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const adminId = "ff000000-0000-0000-0000-000000000000";
export const colorPass = "#89BE59";
export const colorFail = "#FB5757";
export const colorSkip = "#FFB421";
export const keyUserCapabilities = "userCapabilities";

export const validateEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;

  //alert("You have entered an invalid email address!")
  toast.error("Invalid Email");
  return false;
};

export const validateMobileNumber = (mobileNumber) => {
  if (/^[6-9]\d{9}$/.test(mobileNumber)) return true;
  toast.error("Invalid Mobile Number");
  return false;
};

export const getDaysDifference = (date1, date2) => {
  // console.log("Date1:", date1, "Date2", date2)
  const diffTime = Math.abs(new Date(date1) - new Date(date2));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

export const shortDateFormat = {
  timeZone: "Asia/Kolkata",
  hour12: false,
  day: "numeric",
  month: "2-digit",
  year: "numeric",
}

export const shortFullDateFormat = {
  timeZone: "Asia/Kolkata",
  hour12: false,
  day: "numeric",
  month: "2-digit",
  year: "numeric",
  minute: "2-digit",
  hour: "2-digit",
  second: "2-digit"
}

export const renderExecutionTime = (execTime) => {

  const h = Math.trunc(execTime)
  const m = Math.ceil((execTime - Math.trunc(execTime)) * 60)

  return (h + "h " + m + "m")
}

export const convertToTwoDecimalPlaces = (number) => {
  if (number)
    return (Math.round(number * 100) / 100).toFixed(2)
  return 0
}

export const handleBuildChange = (navigate, data, event) => {
  const build = {
    _id: event.target.value.id,
    build_number: event.target.value.build_number,
  }
  if (window.location.pathname === "/dashboard")
    navigate("/build-portal", { state: { build: build, project: data.project, currentSprint: event.target.value.sprint, origin: "dashboard" } })
  else navigate("/build-portal", { state: { build: build, project: data.project, currentSprint: event.target.value.sprint, loc: "drawer" } })
}

export const allowPastSprint = (startDate, endDate) => {
  if (dayjs().isBetween(dayjs(startDate), dayjs(endDate)))
    return true
  else return true
}