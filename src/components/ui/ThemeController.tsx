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
  {
    name: "cupcake",
    value: "cupcake",
  },
  {
    name: "emerald",
    value: "emerald",
  },
  {
    name: "synthwave",
    value: "synthwave",
  },
  {
    name: "retro",
    value: "retro",
  },
  {
    name: "valentine",
    value: "valentine",
  },
  {
    name: "halloween",
    value: "halloween",
  },
  {
    name: "forest",
    value: "forest",
  },
  {
    name: "aqua",
    value: "aqua",
  },
  {
    name: "pastel",
    value: "pastel",
  },
  {
    name: "fantasy",
    value: "fantasy",
  },
  {
    name: "wireframe",
    value: "wireframe",
  },
  {
    name: "black",
    value: "black",
  },
  {
    name: "luxury",
    value: "luxury",
  },
  {
    name: "dracula",
    value: "dracula",
  },
  {
    name: "cmyk",
    value: "cmyk",
  },
  {
    name: "autumn",
    value: "autumn",
  },
  {
    name: "business",
    value: "business",
  },
  {
    name: "lemonade",
    value: "lemonade",
  },
  {
    name: "night",
    value: "night",
  },
  {
    name: "coffee",
    value: "coffee",
  },
  {
    name: "winter",
    value: "winter",
  },
  {
    name: "dim",
    value: "dim",
  },
  {
    name: "nord",
    value: "nord",
  },
  {
    name: "sunset",
    value: "sunset",
  },
];

export default function ThemeController() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChangeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value);
  }

  return (
    <div className="dropdown dropdown-left">
      <div tabIndex={0} role="button" className="btn btn-sm">
        Theme: {theme}
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
