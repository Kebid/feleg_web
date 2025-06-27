import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function FloatingControls() {
  return (
    <div className="fixed top-1/3 right-6 z-50 flex flex-col items-center gap-3 pointer-events-none select-none">
      <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl rounded-full px-4 py-2 border border-gray-200/40 dark:border-gray-700/40 transition-all hover:shadow-2xl hover:scale-105 pointer-events-auto select-auto">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </div>
  );
} 