"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'am', label: 'አማ' },
  { code: 'om', label: 'OM' },
  { code: 'ti', label: 'ትግ' },
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Safe locale hook with fallback
  let currentLocale = 'en';
  try {
    currentLocale = useLocale();
  } catch (localeError) {
    console.warn('Locale hook failed, using fallback:', localeError);
    currentLocale = 'en';
  }

  const handleLocaleChange = (locale: string) => {
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex gap-2">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleLocaleChange(code)}
          className={`px-3 py-1 rounded border text-sm font-medium transition-colors
            ${currentLocale === code ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
} 