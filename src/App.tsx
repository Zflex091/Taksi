import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  Clock3,
  CreditCard,
  Fuel,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  MapPinned,
  Minus,
  Phone,
  Plus,
  Route,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";

import PlaceField from "./components/PlaceField";
import type {
  Booking,
  PaymentMethod,
  Place,
} from "./types";

type Language = "lt" | "en";

const DRIVER_PHONE = "+370 662 15037";
const DRIVER_PHONE_LINK = "+370 662 15037";
const VEHICLE_NAME = "Opel Astra";
const VEHICLE_PLATE = "T21796";

const translations = {
  lt: {
    pageTitle: "ADV services – privatus pervežimas",

    route: "Maršrutas",
    contacts: "Kontaktai",
    payment: "Apmokėjimas",

    eyebrow: "Tvaresnė kelionė po Kauną",
    heroTitleFirst: "Patogiai. Saugiai.",
    heroTitleSecond: "Atsakingiau.",
    heroDescription:
      "Privatus pervežimas naujais automobiliais, naudojant atsinaujinančius degalus. Kainą matote dar prieš rezervaciją.",

    pricePerKm: "1,90 € / km",
    minimumDistance: "Min. 7 km",
    maxPassengers: "Iki 3 keleivių",

    estimatedPrice: "Orientacinė kaina",
    airportCityPrice:
      "Kauno oro uostas → miesto centras: 30–35 €",

    whereGoing: "Kur keliausite?",
    routeDescription:
      "Įveskite adresą ir pasirinkite tikslų variantą iš sąrašo.",

    pickup: "Iš kur",
    pickupPlaceholder: "Adresas, oro uostas ar vieta",
    destination: "Kur",
    destinationPlaceholder: "Kelionės tikslas",

    date: "Data",
    pickupTime: "Paėmimo laikas",
    reservationLimit:
      "Rezervacija galima ne anksčiau nei po 2 val.",

    passengers: "Keleiviai",
    luggage: "Bagažas",

    decrease: "Mažinti",
    increase: "Didinti",

    selectRouteError:
      "Pasirinkite abu adresus iš pateikto sąrašo ir nurodykite kelionės laiką.",
    earliestTimeError:
      "Artimiausias galimas laikas šiandien yra",
    routeError: "Maršruto apskaičiuoti nepavyko.",

    calculating: "Skaičiuojama...",
    calculatePrice: "Apskaičiuoti kainą",

    changeRoute: "Keisti maršrutą",
    yourContacts: "Jūsų kontaktai",
    contactDescription:
      "Duomenys reikalingi rezervacijos patvirtinimui.",

    distance: "Atstumas",
    duration: "Trukmė",
    minutes: "min.",

    firstName: "Vardas",
    lastName: "Pavardė",
    phoneNumber: "Telefono numeris",

    firstNamePlaceholder: "Vardas",
    lastNamePlaceholder: "Pavardė",
    phonePlaceholder: "+370 662 15037",

    contactError:
      "Įveskite vardą, pavardę ir galiojantį telefono numerį.",

    continuePayment: "Tęsti į apmokėjimą",

    back: "Grįžti",
    howPay: "Kaip mokėsite?",
    finalPriceCalculated: "Galutinė kaina jau apskaičiuota.",
    finalTripPrice: "Galutinė kelionės kaina",
    chargedKm: "apmokestinamo km",

    payDriver: "Automobilyje",
    payDriverText:
      "Grynaisiais arba banko kortele vairuotojui",

    payStripe: "Apmokėti dabar",
    payStripeText:
      "Saugus internetinis mokėjimas per Stripe",
    recommended: "Rekomenduojama",

    securePayment:
      "Mokėjimo kortelės duomenys svetainėje nėra saugomi.",

    processing: "Vykdoma...",
    secureCheckout: "Pereiti į saugų mokėjimą",
    confirmBooking: "Patvirtinti rezervaciją",

    stripeError:
      "Nepavyko pradėti Stripe mokėjimo.",
    reservationError: "Rezervacija nepavyko.",

    reservationAccepted: "Rezervacija patvirtinta",
    bookingNumber: "Jūsų rezervacijos numeris",

    tripReady: "Jūsų kelionė paruošta",
    waitingAt: "Jūsų lauks",
    pickupTimeLabel: "Paėmimo laikas",
    vehicle: "Automobilis",
    plate: "Valstybinis numeris",
    supportTitle: "Kilus nesklandumams susisiekite",
    supportText:
      "Jeigu pasikeistų kelionės aplinkybės arba nepavyktų rasti automobilio, paskambinkite mums.",

    greenCourse: "Žalias kursas",
    newCars: "Nauji automobiliai",
    safety: "Saugumas",

    mainDifference: "Pagrindinis mūsų išskirtinumas",
    renewableTitleFirst: "Atsinaujinantys degalai.",
    renewableTitleSecond: "Mažesnis pėdsakas.",
    renewableDescription:
      "Renkamės atsinaujinančius degalus ir efektyvius, naujesnius automobilius, kad kiekviena kelionė būtų ne tik patogi, bet ir atsakingesnė planetai.",

    renewableFuel: "Renewable fuel",
    renewableFuelDescription:
      "Atsinaujinančių išteklių degalai",

    efficientFleet: "Efektyvesnis parkas",
    efficientFleetDescription:
      "Nauji, reguliariai prižiūrimi automobiliai",

    fewerEmissions: "Mažiau emisijų",
    cleanerJourney: "Švaresnė kelionė",

    newCarsDescription:
      "Iki 3 keleivių ir 3 lagaminų",
    transparentPrice: "Skaidri kaina",
    transparentPriceDescription:
      "Matoma prieš užsakymą",
    safetyDescription:
      "Patikimas vairuotojas ir prižiūrėtas automobilis",

    footer:
      "Žalias kursas · Nauji automobiliai · Saugumas",
  },

  en: {
    pageTitle: "ADV services – private transfers",

    route: "Route",
    contacts: "Contact details",
    payment: "Payment",

    eyebrow: "A more sustainable journey in Kaunas",
    heroTitleFirst: "Comfortable. Safe.",
    heroTitleSecond: "More responsible.",
    heroDescription:
      "Private transfers in newer vehicles using renewable fuel. See the full price before making a reservation.",

    pricePerKm: "€1.90 / km",
    minimumDistance: "Minimum 7 km",
    maxPassengers: "Up to 3 passengers",

    estimatedPrice: "Estimated price",
    airportCityPrice:
      "Kaunas Airport → city centre: €30–35",

    whereGoing: "Where are you going?",
    routeDescription:
      "Enter an address and select the exact option from the list.",

    pickup: "Pickup location",
    pickupPlaceholder: "Address, airport or place",
    destination: "Destination",
    destinationPlaceholder: "Enter your destination",

    date: "Date",
    pickupTime: "Pickup time",
    reservationLimit:
      "Reservations must be made at least 2 hours in advance.",

    passengers: "Passengers",
    luggage: "Luggage",

    decrease: "Decrease",
    increase: "Increase",

    selectRouteError:
      "Select both addresses from the list and specify the pickup time.",
    earliestTimeError:
      "The earliest available time today is",
    routeError: "The route could not be calculated.",

    calculating: "Calculating...",
    calculatePrice: "Calculate price",

    changeRoute: "Change route",
    yourContacts: "Your contact details",
    contactDescription:
      "These details are required to confirm your reservation.",

    distance: "Distance",
    duration: "Duration",
    minutes: "min.",

    firstName: "First name",
    lastName: "Last name",
    phoneNumber: "Phone number",

    firstNamePlaceholder: "First name",
    lastNamePlaceholder: "Last name",
    phonePlaceholder: "+370 662 15037",

    contactError:
      "Enter your first name, last name and a valid phone number.",

    continuePayment: "Continue to payment",

    back: "Back",
    howPay: "How would you like to pay?",
    finalPriceCalculated:
      "The final price has already been calculated.",
    finalTripPrice: "Total trip price",
    chargedKm: "billable km",

    payDriver: "Pay in the vehicle",
    payDriverText:
      "Pay the driver by cash or bank card",

    payStripe: "Pay now",
    payStripeText:
      "Secure online payment through Stripe",
    recommended: "Recommended",

    securePayment:
      "Your card details are not stored on this website.",

    processing: "Processing...",
    secureCheckout: "Continue to secure payment",
    confirmBooking: "Confirm reservation",

    stripeError:
      "Unable to start the Stripe payment.",
    reservationError:
      "The reservation could not be completed.",

    reservationAccepted: "Reservation confirmed",
    bookingNumber: "Your reservation number",

    tripReady: "Your journey is ready",
    waitingAt: "Your vehicle will be waiting",
    pickupTimeLabel: "Pickup time",
    vehicle: "Vehicle",
    plate: "License plate",
    supportTitle: "Need assistance?",
    supportText:
      "If your travel plans change or you cannot find the vehicle, please call us.",

    greenCourse: "Green travel",
    newCars: "New vehicles",
    safety: "Safety",

    mainDifference: "What makes us different",
    renewableTitleFirst: "Renewable fuel.",
    renewableTitleSecond: "A smaller footprint.",
    renewableDescription:
      "We choose renewable fuel and efficient, newer vehicles so that every journey is not only comfortable, but also more responsible for the planet.",

    renewableFuel: "Renewable fuel",
    renewableFuelDescription:
      "Fuel produced from renewable resources",

    efficientFleet: "Efficient fleet",
    efficientFleetDescription:
      "Newer, regularly maintained vehicles",

    fewerEmissions: "Fewer emissions",
    cleanerJourney: "Cleaner journey",

    newCarsDescription:
      "Up to 3 passengers and 3 suitcases",
    transparentPrice: "Transparent price",
    transparentPriceDescription:
      "Displayed before reservation",
    safetyDescription:
      "A reliable driver and a maintained vehicle",

    footer:
      "Green travel · New vehicles · Safety",
  },
} as const;

const today = new Date().toISOString().slice(0, 10);

const initialBooking: Booking = {
  pickup: null,
  destination: null,
  date: today,
  time: "",
  passengers: 1,
  luggage: 0,
  firstName: "",
  lastName: "",
  phone: "",
  paymentMethod: "driver",
  distanceKm: 0,
  durationMin: 0,
  price: 0,
};

function nextAllowedTime(date: string) {
  if (date !== today) {
    return "00:00";
  }

  const nextTime = new Date(
    Date.now() + 2 * 60 * 60 * 1000,
  );

  return `${String(nextTime.getHours()).padStart(
    2,
    "0",
  )}:${String(nextTime.getMinutes()).padStart(2, "0")}`;
}

type CounterProps = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  icon: ReactNode;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  min?: number;
};

function Counter({
  value,
  onChange,
  max,
  icon,
  label,
  decreaseLabel,
  increaseLabel,
  min = 0,
}: CounterProps) {
  return (
    <div className="counter">
      <div className="counter-label">
        {icon}
        <span>{label}</span>
      </div>

      <div className="counter-actions">
        <button
          type="button"
          aria-label={`${decreaseLabel} ${label}`}
          onClick={() =>
            onChange(Math.max(min, value - 1))
          }
        >
          <Minus />
        </button>

        <strong>{value}</strong>

        <button
          type="button"
          aria-label={`${increaseLabel} ${label}`}
          onClick={() =>
            onChange(Math.min(max, value + 1))
          }
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] =
    useState<Language>(() => {
      const savedLanguage = localStorage.getItem(
        "adv-language",
      );

      return savedLanguage === "en" ? "en" : "lt";
    });

  const [booking, setBooking] =
    useState<Booking>(initialBooking);
  const [step, setStep] = useState(1);
  const [routeLoading, setRouteLoading] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const t = translations[language];

  const minTime = useMemo(
    () => nextAllowedTime(booking.date),
    [booking.date],
  );

  useEffect(() => {
    localStorage.setItem("adv-language", language);
    document.documentElement.lang = language;
    document.title = t.pageTitle;
  }, [language, t.pageTitle]);

  const update = <K extends keyof Booking>(
    key: K,
    value: Booking[K],
  ) => {
    setBooking((currentBooking) => ({
      ...currentBooking,
      [key]: value,
    }));
  };

  async function calculate() {
    setError("");

    if (
      !booking.pickup ||
      !booking.destination ||
      !booking.date ||
      !booking.time
    ) {
      setError(t.selectRouteError);
      return;
    }

    if (
      booking.date === today &&
      booking.time < minTime
    ) {
      setError(`${t.earliestTimeError} ${minTime}.`);
      return;
    }

    setRouteLoading(true);

    try {
      const query = new URLSearchParams({
        from: `${booking.pickup.lon},${booking.pickup.lat}`,
        to: `${booking.destination.lon},${booking.destination.lat}`,
      });

      const response = await fetch(`/api/route?${query}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.routeError);
      }

      const billableDistance = Math.max(
        7,
        data.distanceKm,
      );

      setBooking((currentBooking) => ({
        ...currentBooking,
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        price: Number(
          (billableDistance * 1.9).toFixed(2),
        ),
      }));

      setStep(2);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t.routeError,
      );
    } finally {
      setRouteLoading(false);
    }
  }

  function validateContact() {
    setError("");

    const validPhone =
      booking.phone.replace(/\D/g, "").length >= 8;

    if (
      !booking.firstName.trim() ||
      !booking.lastName.trim() ||
      !validPhone
    ) {
      setError(t.contactError);
      return;
    }

    setStep(3);
  }

  async function submit() {
    setError("");
    setSubmitting(true);

    try {
      if (booking.paymentMethod === "stripe") {
        const response = await fetch(
          "/api/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(booking),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || t.stripeError,
          );
        }

        if (!data.url) {
          throw new Error(t.stripeError);
        }

        window.location.href = data.url;
        return;
      }

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || t.reservationError,
        );
      }

      setDone(data.bookingCode);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t.reservationError,
      );
    } finally {
      setSubmitting(false);
    }
  }

  function setPlace(
    key: "pickup" | "destination",
    place: Place | null,
  ) {
    update(key, place);
  }

  return (
    <div className="site-shell">
      <header>
        <a className="brand" href="#top">
          <img
            src="/adv-logo.svg"
            alt="ADV services"
          />

          <b>
            ADV <em>services</em>
          </b>
        </a>

        <div className="header-actions">
          <div
            className="language-switcher"
            aria-label="Language selection"
          >
            <button
              type="button"
              className={
                language === "lt" ? "active" : ""
              }
              onClick={() => setLanguage("lt")}
              aria-pressed={language === "lt"}
            >
              LT
            </button>

            <span />

            <button
              type="button"
              className={
                language === "en" ? "active" : ""
              }
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>

          <a
            className="phone"
            href={`tel:${DRIVER_PHONE_LINK}`}
          >
            <Phone />
            <span>{DRIVER_PHONE}</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            <Leaf />
            {t.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {t.heroTitleFirst}
            <br />
            <em>{t.heroTitleSecond}</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
          >
            {t.heroDescription}
          </motion.p>

          <div className="benefits">
            <div>
              <Check />
              {t.pricePerKm}
            </div>

            <div>
              <Check />
              {t.minimumDistance}
            </div>

            <div>
              <Check />
              {t.maxPassengers}
            </div>
          </div>

          <div className="city-price">
            <MapPinned />

            <span>
              <small>{t.estimatedPrice}</small>
              <b>{t.airportCityPrice}</b>
            </span>
          </div>
        </section>

        <motion.section
          id="booking"
          className="booking-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="steps">
            {[1, 2, 3].map((number) => {
              const stepLabel =
                number === 1
                  ? t.route
                  : number === 2
                    ? t.contacts
                    : t.payment;

              return (
                <div
                  key={number}
                  className={
                    step >= number ? "active" : ""
                  }
                >
                  <span>
                    {step > number ? <Check /> : number}
                  </span>

                  <small>{stepLabel}</small>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                className="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon">
                  <Check />
                </div>

                <h2>{t.reservationAccepted}</h2>
                <p>{t.bookingNumber}</p>
                <strong>{done}</strong>

                <div className="driver-info">
                  <div className="driver-info-heading">
                    <CarFront />

                    <div>
                      <small>{t.tripReady}</small>
                      <h3>
                        {booking.time} {t.waitingAt}{" "}
                        {VEHICLE_NAME}
                      </h3>
                    </div>
                  </div>

                  <div className="driver-card">
                    <div className="driver-row">
                      <span>{t.pickupTimeLabel}</span>
                      <b>{booking.time}</b>
                    </div>

                    <div className="driver-row">
                      <span>{t.vehicle}</span>
                      <b>{VEHICLE_NAME}</b>
                    </div>

                    <div className="driver-row">
                      <span>{t.plate}</span>
                      <b className="vehicle-plate">
                        {VEHICLE_PLATE}
                      </b>
                    </div>
                  </div>

                  <a
                    className="support-box"
                    href={`tel:${DRIVER_PHONE_LINK}`}
                  >
                    <div className="support-icon">
                      <Phone />
                    </div>

                    <span>
                      <b>{t.supportTitle}</b>
                      <small>{t.supportText}</small>
                      <strong>{DRIVER_PHONE}</strong>
                    </span>
                  </a>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="card-heading">
                  <span>01</span>

                  <div>
                    <h2>{t.whereGoing}</h2>
                    <p>{t.routeDescription}</p>
                  </div>
                </div>

                <div className="route-fields">
                  <PlaceField
                    label={t.pickup}
                    placeholder={t.pickupPlaceholder}
                    value={booking.pickup}
                    onChange={(place) =>
                      setPlace("pickup", place)
                    }
                  />

                  <div className="route-line" />

                  <PlaceField
                    label={t.destination}
                    placeholder={
                      t.destinationPlaceholder
                    }
                    value={booking.destination}
                    onChange={(place) =>
                      setPlace("destination", place)
                    }
                  />
                </div>

                <div className="grid2">
                  <div className="field-wrap">
                    <label>{t.date}</label>

                    <div className="input-icon">
                      <CalendarDays />

                      <input
                        type="date"
                        min={today}
                        value={booking.date}
                        onChange={(event) =>
                          update(
                            "date",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label>{t.pickupTime}</label>

                    <div className="input-icon">
                      <Clock3 />

                      <input
                        type="time"
                        min={minTime}
                        value={booking.time}
                        onChange={(event) =>
                          update(
                            "time",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <small className="helper">
                      {t.reservationLimit}
                    </small>
                  </div>
                </div>

                <div className="grid2">
                  <Counter
                    min={1}
                    value={booking.passengers}
                    onChange={(value) =>
                      update("passengers", value)
                    }
                    max={3}
                    icon={<UserRound />}
                    label={t.passengers}
                    decreaseLabel={t.decrease}
                    increaseLabel={t.increase}
                  />

                  <Counter
                    value={booking.luggage}
                    onChange={(value) =>
                      update("luggage", value)
                    }
                    max={3}
                    icon={<BriefcaseBusiness />}
                    label={t.luggage}
                    decreaseLabel={t.decrease}
                    increaseLabel={t.increase}
                  />
                </div>

                {error && (
                  <div className="error">{error}</div>
                )}

                <button
                  className="primary"
                  type="button"
                  onClick={calculate}
                  disabled={routeLoading}
                >
                  {routeLoading ? (
                    <>
                      <LoaderCircle className="spin" />
                      {t.calculating}
                    </>
                  ) : (
                    <>
                      {t.calculatePrice}
                      <ArrowRight />
                    </>
                  )}
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  className="back"
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                >
                  <ChevronLeft />
                  {t.changeRoute}
                </button>

                <div className="card-heading">
                  <span>02</span>

                  <div>
                    <h2>{t.yourContacts}</h2>
                    <p>{t.contactDescription}</p>
                  </div>
                </div>

                <div className="trip-summary">
                  <div>
                    <Route />

                    <span>
                      <small>{t.distance}</small>
                      <b>
                        {booking.distanceKm.toFixed(1)} km
                      </b>
                    </span>
                  </div>

                  <div>
                    <Clock3 />

                    <span>
                      <small>{t.duration}</small>
                      <b>
                        ~{booking.durationMin}{" "}
                        {t.minutes}
                      </b>
                    </span>
                  </div>

                  <strong>
                    {booking.price.toFixed(2)} €
                  </strong>
                </div>

                <div className="grid2">
                  <div className="field-wrap">
                    <label>{t.firstName}</label>

                    <input
                      value={booking.firstName}
                      onChange={(event) =>
                        update(
                          "firstName",
                          event.target.value,
                        )
                      }
                      placeholder={
                        t.firstNamePlaceholder
                      }
                    />
                  </div>

                  <div className="field-wrap">
                    <label>{t.lastName}</label>

                    <input
                      value={booking.lastName}
                      onChange={(event) =>
                        update(
                          "lastName",
                          event.target.value,
                        )
                      }
                      placeholder={
                        t.lastNamePlaceholder
                      }
                    />
                  </div>
                </div>

                <div className="field-wrap">
                  <label>{t.phoneNumber}</label>

                  <div className="input-icon">
                    <Phone />

                    <input
                      type="tel"
                      value={booking.phone}
                      onChange={(event) =>
                        update(
                          "phone",
                          event.target.value,
                        )
                      }
                      placeholder={t.phonePlaceholder}
                    />
                  </div>
                </div>

                {error && (
                  <div className="error">{error}</div>
                )}

                <button
                  className="primary"
                  type="button"
                  onClick={validateContact}
                >
                  {t.continuePayment}
                  <ArrowRight />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  className="back"
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(2);
                  }}
                >
                  <ChevronLeft />
                  {t.back}
                </button>

                <div className="card-heading">
                  <span>03</span>

                  <div>
                    <h2>{t.howPay}</h2>
                    <p>{t.finalPriceCalculated}</p>
                  </div>
                </div>

                <div className="final-price">
                  <span>{t.finalTripPrice}</span>

                  <strong>
                    {booking.price.toFixed(2)} €
                  </strong>

                  <small>
                    {Math.max(
                      7,
                      booking.distanceKm,
                    ).toFixed(1)}{" "}
                    {t.chargedKm} × 1,90 €
                  </small>
                </div>

                <PaymentChoice
                  value="driver"
                  selected={booking.paymentMethod}
                  onClick={(value) =>
                    update("paymentMethod", value)
                  }
                  icon={<Banknote />}
                  title={t.payDriver}
                  text={t.payDriverText}
                />

                <PaymentChoice
                  value="stripe"
                  selected={booking.paymentMethod}
                  onClick={(value) =>
                    update("paymentMethod", value)
                  }
                  icon={<CreditCard />}
                  title={t.payStripe}
                  text={t.payStripeText}
                  badge={t.recommended}
                />

                <div className="secure-note">
                  <LockKeyhole />
                  {t.securePayment}
                </div>

                {error && (
                  <div className="error">{error}</div>
                )}

                <button
                  className="primary"
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="spin" />
                      {t.processing}
                    </>
                  ) : booking.paymentMethod ===
                    "stripe" ? (
                    <>
                      {t.secureCheckout}
                      <ArrowRight />
                    </>
                  ) : (
                    <>
                      {t.confirmBooking}
                      <ArrowRight />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      <section className="promise-bar">
        <span>{t.greenCourse}</span>
        <i>•</i>
        <span>{t.newCars}</span>
        <i>•</i>
        <span>{t.safety}</span>
      </section>

      <section id="green" className="green-section">
        <div className="green-copy">
          <div className="eyebrow">
            <Fuel />
            {t.mainDifference}
          </div>

          <h2>
            {t.renewableTitleFirst}
            <br />
            {t.renewableTitleSecond}
          </h2>

          <p>{t.renewableDescription}</p>

          <div className="green-points">
            <div>
              <Leaf />

              <span>
                <b>{t.renewableFuel}</b>
                <small>
                  {t.renewableFuelDescription}
                </small>
              </span>
            </div>

            <div>
              <Zap />

              <span>
                <b>{t.efficientFleet}</b>
                <small>
                  {t.efficientFleetDescription}
                </small>
              </span>
            </div>
          </div>
        </div>

        <div className="eco-orbit">
          <div className="orbit o1" />
          <div className="orbit o2" />

          <div className="planet">
            <Leaf />
          </div>

          <span className="eco-tag t1">
            {t.fewerEmissions}
          </span>

          <span className="eco-tag t2">
            {t.cleanerJourney}
          </span>

          <span className="eco-tag t3">
            {t.greenCourse}
          </span>
        </div>
      </section>

      <section id="safety" className="trust-strip">
        <div>
          <CarFront />

          <span>
            <b>{t.newCars}</b>
            <small>{t.newCarsDescription}</small>
          </span>
        </div>

        <div>
          <MapPinned />

          <span>
            <b>{t.transparentPrice}</b>
            <small>
              {t.transparentPriceDescription}
            </small>
          </span>
        </div>

        <div>
          <ShieldCheck />

          <span>
            <b>{t.safety}</b>
            <small>{t.safetyDescription}</small>
          </span>
        </div>
      </section>

      <footer>
        © 2026 ADV services
        <span>{t.footer}</span>
      </footer>
    </div>
  );
}

type PaymentChoiceProps = {
  value: PaymentMethod;
  selected: PaymentMethod;
  onClick: (value: PaymentMethod) => void;
  icon: ReactNode;
  title: string;
  text: string;
  badge?: string;
};

function PaymentChoice({
  value,
  selected,
  onClick,
  icon,
  title,
  text,
  badge,
}: PaymentChoiceProps) {
  return (
    <button
      type="button"
      className={`pay-choice ${
        selected === value ? "selected" : ""
      }`}
      onClick={() => onClick(value)}
    >
      <div className="pay-icon">{icon}</div>

      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>

      {badge && <em>{badge}</em>}

      <i>{selected === value && <Check />}</i>
    </button>
  );
}