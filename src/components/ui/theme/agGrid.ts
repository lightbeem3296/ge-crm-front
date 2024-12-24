import { themeQuartz } from "ag-grid-community";

export const lightTheme = themeQuartz;

export const darkTheme = themeQuartz.withParams({
  borderColor:'rgb(50, 50, 50)',
  backgroundColor: 'rgb(40, 40, 45)',
  foregroundColor: 'rgb(160, 160, 160)',
  headerTextColor: 'rgb(160, 160, 160)',
  headerBackgroundColor: 'rgb(30, 30, 40)',
  oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
  headerColumnResizeHandleColor: 'rgb(126, 126, 132)',
});

export const myTheme = localStorage.getItem("theme") === "light" ? lightTheme : darkTheme;
