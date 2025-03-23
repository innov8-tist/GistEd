
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  name: string;
};

interface LanguageSelectorProps {
  onChange?: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({ code: "en", name: "English" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "ml", name: "Malayalam" },
    { code: "ta", name: "Tamil" },
  ];

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    if (onChange) {
      onChange(language.code);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
        aria-label="Select language"
      >
        <Globe className="text-gray-700" size={20} />
      </button>

      {/* Language dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-200 transform origin-top-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={cn(
                "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors",
                language.code === selectedLanguage.code
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700"
              )}
              role="menuitem"
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
