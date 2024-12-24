import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const themeList = [
  {
    name: "light",
    value: "light",
  },
  {
    name: "dark",
    value: "dark",
  },
];

export default function ThemeController() {
  const [theme, setTheme] = useState<string>("none");

  useEffect(() => {
    if (theme !== "none") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage?.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    setTheme(localStorage?.getItem("theme") || "light");
  }, []);

  const handleChangeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value);
    window.location.reload();
  }

  return (
    <div className="dropdown dropdown-left">
      <div tabIndex={0} role="button" className="btn btn-sm">
        Theme
        <FontAwesomeIcon icon={faAngleDown} width={12} />
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-[calc(100vh-2rem)] overflow-auto">
        {
          themeList.map((theme) => (
            <li key={theme.value}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label={theme.name}
                value={theme.value}
                onChange={handleChangeTheme}
              />
            </li>
          ))
        }
      </ul>
    </div>
  )
}
