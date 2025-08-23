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
  ...props
}) => {
  const apiClient = new APIClient(endPoint);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, delay);
  const observer = useRef(null);
  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: ({ pageParam }) =>
      apiClient.getAll({ page: pageParam, limit: 3, search: debouncedSearch }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const morePagesExist = lastPage.data.length > 0;
      return morePagesExist ? allPages.length + 1 : undefined;
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
  const toggelOptionArea = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  useEffect(() => {
    const onBodyClick = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("click", onBodyClick);

    return () => {
      window.removeEventListener("click", onBodyClick);
    };
  }, [isOpen]);

  return (
    <div className="select-input">
      {label && (
        <label className="title" onClick={toggelOptionArea}>
          {label}
        </label>
      )}
      <div {...props}>
        <div onClick={toggelOptionArea}>
          {placeholder} <i className="fa-solid fa-chevron-down"></i>
        </div>
        <article className={isOpen ? "active" : ""}>
          <label htmlFor="search" onClick={stopPropagation}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
              }}
              placeholder="search ..."
              id="search"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </label>
          {items?.map((itm, i) => (
            <h3
              key={itm._id}
              onClick={() => {
                onChange(itm);
              }}
              ref={i === items?.length - 1 ? lastElement : null}
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
            {value}
          </Button>
        )
      )}
      {errorText && <p className="color-red">{errorText}</p>}
    </div>
  );
};

export default SelectInputApi;
