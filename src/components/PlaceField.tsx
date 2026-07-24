import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  AlertCircle,
  LoaderCircle,
  MapPin,
} from "lucide-react";
import type { Place } from "../types";

type PlaceFieldProps = {
  label: string;
  placeholder: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
};

type ApiError = {
  error?: string;
};

export default function PlaceField({
  label,
  placeholder,
  value,
  onChange,
}: PlaceFieldProps) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(
    null
  );

  useEffect(() => {
    if (value && value.label !== query) {
      setQuery(value.label);
    }
  }, [value]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    // Pasirinktas adresas – naujos paieškos nebereikia.
    if (value?.label === query) {
      setPlaces([]);
      setDropdownOpen(false);
      setError("");
      setLoading(false);
      return;
    }

    // Paieška pradedama nuo 2 simbolių.
    if (trimmedQuery.length < 2) {
      abortControllerRef.current?.abort();
      setPlaces([]);
      setDropdownOpen(false);
      setError("");
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError("");
      setActiveIndex(-1);

      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(trimmedQuery)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        const contentType =
          response.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
          const responseText = await response.text();

          console.error(
            "Adresų API grąžino ne JSON:",
            responseText
          );

          throw new Error(
            "Serveris grąžino netinkamą atsakymą."
          );
        }

        const result = (await response.json()) as
          | Place[]
          | ApiError;

        if (!response.ok) {
          const apiError = result as ApiError;

          throw new Error(
            apiError.error ||
              `Adresų serverio klaida (${response.status}).`
          );
        }

        if (!Array.isArray(result)) {
          throw new Error(
            "Serveris grąžino netinkamą adresų sąrašą."
          );
        }

        const validPlaces = result.filter(
          (place): place is Place =>
            typeof place.label === "string" &&
            typeof place.lat === "number" &&
            typeof place.lon === "number"
        );

        setPlaces(validPlaces);
        setDropdownOpen(true);

        if (validPlaces.length === 0) {
          setError(
            "Adresų nerasta. Įveskite tikslesnį adresą."
          );
        }
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Adresų paieška nepavyko.";

        console.error("Adresų paieškos klaida:", caughtError);

        setPlaces([]);
        setError(message);
        setDropdownOpen(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query, value]);

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newValue = event.target.value;

    setQuery(newValue);
    onChange(null);
    setError("");
    setActiveIndex(-1);

    if (newValue.trim().length >= 2) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  }

  function selectPlace(place: Place) {
    setQuery(place.label);
    onChange(place);
    setPlaces([]);
    setError("");
    setDropdownOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (!dropdownOpen || places.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex >= places.length - 1
          ? 0
          : currentIndex + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex <= 0
          ? places.length - 1
          : currentIndex - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectPlace(places[activeIndex]);
    }

    if (event.key === "Escape") {
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="field-wrap" ref={wrapperRef}>
      <label>{label}</label>

      <div className="input-icon">
        <MapPin size={19} aria-hidden="true" />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (
              query.trim().length >= 2 &&
              (places.length > 0 || error)
            ) {
              setDropdownOpen(true);
            }
          }}
          aria-autocomplete="list"
          aria-expanded={dropdownOpen}
        />

        {loading && (
          <LoaderCircle
            className="field-loader"
            size={18}
            aria-label="Ieškoma"
          />
        )}
      </div>

      {dropdownOpen && (
        <div className="suggestions" role="listbox">
          {error ? (
            <div className="suggestion-error">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          ) : (
            places.map((place, index) => (
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                className={
                  activeIndex === index
                    ? "suggestion-active"
                    : ""
                }
                key={`${place.lat}-${place.lon}-${index}`}
                onMouseDown={(event) => {
                  // Neleidžia input laukui prarasti fokusą
                  // prieš pasirenkant adresą.
                  event.preventDefault();
                }}
                onClick={() => selectPlace(place)}
              >
                <MapPin size={17} aria-hidden="true" />

                <span>{place.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}