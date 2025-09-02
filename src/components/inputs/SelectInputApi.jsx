import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import APIClient from "../../utils/ApiClient";
import Button from "../buttons/Button";
import { useDebounce } from "use-debounce";

/**
 * @typedef {Object} SelectInputApiProps
 * @property {string} label - عنوان الحقل (اختياري).
 * @property {string} placeholder - النص الافتراضي الظاهر في حقل البحث أو العرض.
 * @property {(option: any) => string} optionLabel - دالة لتحويل كائن الخيار إلى نص قابل للعرض.
 * @property {(option: any) => void} onChange - دالة تُستدعى عند اختيار خيار من القائمة، تستقبل الكائن المختار.
 * @property {(option?: any) => void} onIgnore - دالة تُستدعى لحذف خيار (في حالة الاختيار المفرد أو المتعدد).
 * @property {any | any[]} value - القيمة الحالية المختارة، يمكن أن تكون كائن أو مصفوفة من الكائنات.
 * @property {boolean} isArray - تحدد إذا كانت القيمة المختارة مصفوفة (اختيار متعدد) أو مفردة.
 * @property {string} endPoint - رابط الـ API لجلب البيانات.
 * @property {string} queryKey - المفتاح المستخدم في React Query للتخزين المؤقت.
 * @property {string} [errorText] - نص الخطأ ليتم عرضه (اختياري).
 * @property {number} [delay=500] - تأخير الـ debounce بالميللي ثانية (اختياري).
 * @param {SelectInputApiProps & React.HTMLAttributes<HTMLDivElement>} props - خصائص الكومبوننت بالإضافة إلى خصائص HTML قياسية للـ div.
 */
const SelectInputApi = ({
  placeholder,
  label,
  optionLabel,
  onChange,
  onIgnore,
  value,
  endPoint,
  queryKey,
  isArray,
  errorText,
  delay = 500,
  addOption,
  name,
  ...props
}) => {
  const apiClient = new APIClient(endPoint);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, delay);
  const observer = useRef(null);
  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        page: pageParam,
        page_size: 3,
        search: debouncedSearch,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.flatMap((page) => page.data).length;
      const totalItems = lastPage.totalCount;

      return loadedItems < totalItems ? allPages.length + 1 : undefined;
    },
  });
  const items = data?.pages?.flatMap((data) => data.data);

  const lastElement = useCallback(
    (node) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage, fetchNextPage]
  );

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleINputFocus = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const onBodyClick = () => {
      if (isOpen) setIsOpen(false);
      setSelectedIndex(-1);
    };

    window.addEventListener("click", onBodyClick);

    return () => {
      window.removeEventListener("click", onBodyClick);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      onChange(items[selectedIndex]);
      setIsOpen(false);
      setSearch("");
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="select-input">
      {label && (
        <label className="title" htmlFor={name || queryKey}>
          {label}
        </label>
      )}
      <div {...props}>
        <label
          htmlFor={name || queryKey}
          onClick={stopPropagation}
          className="auto-complete-search"
        >
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
              setSelectedIndex(-1);
            }}
            placeholder={placeholder}
            onFocus={handleINputFocus}
            onKeyDown={handleKeyDown}
            id={name || queryKey}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </label>
        <article className={isOpen ? "active" : ""}>
          {addOption}
          {items?.map((itm, i) => (
            <h3
              key={itm._id}
              onClick={() => {
                onChange(itm);
              }}
              ref={i === items?.length - 1 ? lastElement : null}
              className={i === selectedIndex ? "highlight" : ""}
            >
              {optionLabel(itm)}
            </h3>
          ))}
          {isFetching && <p>loading...</p>}
          {!hasNextPage && !isFetching && <p>no more data</p>}
        </article>
      </div>
      {isArray && value?.length > 0 ? (
        <div className="array-of-values">
          {value?.map((span, i) => (
            <Button
              onClick={() => onIgnore(span)}
              key={span._id || i}
              btnStyleType="outlined"
              btnType="delete"
            >
              {typeof span === "string" ? span : optionLabel(span)}
            </Button>
          ))}
        </div>
      ) : (
        !isArray &&
        value && (
          <Button onClick={onIgnore} btnStyleType="outlined" btnType="delete">
            {typeof value === "string" ? value : optionLabel(value)}
          </Button>
        )
      )}
      {errorText && <p className="color-red">{errorText}</p>}
    </div>
  );
};

export default SelectInputApi;
