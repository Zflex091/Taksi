import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import {
  AlertCircle,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import type { Place } from "../types";

type Props = {
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
}: Props) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  useEffect(() => {
    if (value?.label && value.label !== query) {
      setQuery(value.label);
    }
  }, [value]);

  useEffect(() => {
    const searchQuery = query.trim();

    if (value?.label === query) {
      setPlaces([]);
      setError("");
      setOpen(false);
      setLoading(false);
      return;
    }

    if (searchQuery.length < 2) {
      abortControllerRef.current?.abort();

      setPlaces([]);
      setError("");
      setOpen(false);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const timeout = window.setTimeout(async () => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError("");
      setOpen(true);

      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(
            searchQuery,
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const contentType =
          response.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
          const text = await response.text();

          console.error(
            "Adresų API grąžino ne JSON:",
            text,
          );

          throw new Error(
            "Adresų serveris grąžino netinkamą atsakymą.",
          );
        }

        const result = (await response.json()) as
          | Place[]
          | ApiError;

        if (!response.ok) {
          throw new Error(
            Array.isArray(result)
              ? "Adresų paieška nepavyko."
              : result.error ||
                  `Adresų serverio klaida (${response.status}).`,
          );
        }

        if (!Array.isArray(result)) {
          throw new Error(
            "Gautas netinkamas adresų sąrašas.",
          );
        }

        const validPlaces = result.filter(
          (place): place is Place =>
            typeof place.label === "string" &&
            Number.isFinite(place.lat) &&
            Number.isFinite(place.lon),
        );

        setPlaces(validPlaces);
        setOpen(true);

        if (validPlaces.length === 0) {
          setError(
            "Adresų nerasta. Įveskite tikslesnį adresą.",
          );
        }
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Adresų paieškos klaida:",
          caughtError,
        );

        setPlaces([]);
        setOpen(true);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Adresų paieška nepavyko.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, value?.label]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const newQuery = event.target.value;

    setQuery(newQuery);
    setPlaces([]);
    setError("");
    setActiveIndex(-1);

    onChange(null);

    if (newQuery.trim().length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function selectPlace(place: Place) {
    abortControllerRef.current?.abort();

    setQuery(place.label);
    setPlaces([]);
    setError("");
    setOpen(false);
    setLoading(false);
    setActiveIndex(-1);

    onChange(place);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (!open || places.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        current >= places.length - 1
          ? 0
          : current + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        current <= 0
          ? places.length - 1
          : current - 1,
      );
    }

    if (
      event.key === "Enter" &&
      activeIndex >= 0
    ) {
      event.preventDefault();
      selectPlace(places[activeIndex]);
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="field-wrap place-field">
      <label>{label}</label>

      <div className="input-icon">
        <MapPin aria-hidden="true" />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          inputMode="search"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setOpen(true);
            }
          }}
          aria-autocomplete="list"
          aria-expanded={open}
        />

        {loading && (
          <LoaderCircle
            className="field-loader"
            aria-label="Ieškoma"
          />
        )}
      </div>

      {open && (
        <div
          className="suggestions suggestions-inline"
          role="listbox"
        >
          {loading && places.length === 0 ? (
            <div className="suggestion-status">
              <LoaderCircle className="spin" />
              <span>Ieškoma adresų...</span>
            </div>
          ) : error ? (
            <div className="suggestion-error">
              <AlertCircle />
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
                onPointerDown={(event) => {
                  event.preventDefault();
                  selectPlace(place);
                }}
              >
                <MapPin aria-hidden="true" />
                <span>{place.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}