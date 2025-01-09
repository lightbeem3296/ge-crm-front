import axios from "axios";

export const isAuthenticated = async () => {
  let ret = false;
  try {
    const accessToken = localStorage.getItem("accessToken");
    await axios.get("/api/auth/ping", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    ret = true;
  } catch {
    console.log("authentication error");
  }
  return ret;
}
