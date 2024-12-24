import { themeQuartz } from "ag-grid-community";

export const lightTheme = themeQuartz;

export const darkTheme = themeQuartz.withParams({
  borderColor:'rgb(50, 50, 50)',
  backgroundColor: 'rgb(25, 30, 36)',
  foregroundColor: 'rgb(160, 160, 160)',
  headerTextColor: 'rgb(160, 160, 160)',
  headerBackgroundColor: 'rgb(19, 23, 28)',
  oddRowBackgroundColor: 'rgb(255, 255, 255, 0.01)',
  headerColumnResizeHandleColor: 'rgb(126, 126, 132)',
});

export const myTheme = localStorage.getItem("theme") === "light" ? lightTheme : darkTheme;
