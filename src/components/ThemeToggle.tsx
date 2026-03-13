import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="shad-button_ghost w-full my-4 flex items-center justify-start gap-4 p-4 text-dark-1 dark:text-light-1"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-[24px] w-[24px] text-primary-500 transition-all" />
          <p className="small-medium lg:base-medium">Light Mode</p>
        </>
      ) : (
        <>
          <Moon className="h-[24px] w-[24px] text-primary-500 transition-all" />
          <p className="small-medium lg:base-medium">Dark Mode</p>
        </>
      )}
    </Button>
  )
}
