import type { VercelRequest, VercelResponse } from "@vercel/node";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  importance?: number;
};

type PlaceResult = {
  label: string;
  lat: number;
  lon: number;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "Leidžiamos tik GET užklausos.",
    });
  }

  const queryValue = Array.isArray(req.query.q)
    ? req.query.q[0]
    : req.query.q;

  const query = String(queryValue ?? "").trim();

  if (query.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("countrycodes", "lt");
    url.searchParams.set("accept-language", "lt");
    url.searchParams.set("limit", "8");

    // Kauno centro koordinatės – Kauno rezultatams suteikia prioritetą.
    url.searchParams.set("viewbox", "23.60,55.10,24.20,54.70");
    url.searchParams.set("bounded", "0");

    // Pakeisk į savo tikrą el. paštą.
    url.searchParams.set(
      "email",
      "lukaviciusp@gmail.com"
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": "lt-LT,lt;q=0.9,en;q=0.7",
        "User-Agent":
          "ADV-services/1.0 (contact: TAVO-EL-PASTAS@gmail.com)",
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Nominatim HTTP klaida:", {
        status: response.status,
        statusText: response.statusText,
        response: responseText,
      });

      return res.status(502).json({
        error: `Adresų tiekėjas neatsakė (${response.status}).`,
      });
    }

    let data: NominatimResult[];

    try {
      data = JSON.parse(responseText) as NominatimResult[];
    } catch {
      console.error(
        "Nominatim grąžino netinkamą JSON:",
        responseText
      );

      return res.status(502).json({
        error: "Adresų tiekėjas grąžino netinkamą atsakymą.",
      });
    }

    if (!Array.isArray(data)) {
      return res.status(502).json({
        error: "Gautas netinkamas adresų sąrašas.",
      });
    }

    const places: PlaceResult[] = data
      .map((item) => ({
        label: item.display_name,
        lat: Number(item.lat),
        lon: Number(item.lon),
      }))
      .filter(
        (item) =>
          item.label &&
          Number.isFinite(item.lat) &&
          Number.isFinite(item.lon)
      );

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json(places);
  } catch (error) {
    console.error("Places API klaida:", error);

    return res.status(500).json({
      error: "Nepavyko atlikti adresų paieškos.",
    });
  }
}