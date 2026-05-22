import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANG_LABELS, type Lang } from "@/i18n/dict";

const SHORT: Record<Lang, string> = { en: "EN", hi: "हिं", mr: "मरा" };

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-md px-2 text-sm font-medium text-foreground hover:bg-muted"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          {!compact && <span className="hidden text-xs sm:inline">{SHORT[lang]}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={l === lang ? "bg-muted font-semibold" : ""}
          >
            <span className="mr-2 text-xs text-muted-foreground">{SHORT[l]}</span>
            {LANG_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
