"use client";
import { usePathname, useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'am', label: 'አማ' },
  { code: 'om', label: 'OM' },
  { code: 'ti', label: 'ትግ' },
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Set currentLocale to 'en' directly
  const currentLocale = 'en';

  const handleLocaleChange = (locale: string) => {
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  return (
    <select
      value={currentLocale}
      onChange={e => handleLocaleChange(e.target.value)}
      className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
      aria-label="Select language"
    >
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
} 