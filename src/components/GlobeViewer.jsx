import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import axios from "axios";

const getPolygonCenter = (geometry) => {
  if (!geometry) return { lat: 0, lng: 0 };

  const allCoords = [];

  const extractCoords = (coords) => {
    if (!Array.isArray(coords)) return;

    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      allCoords.push(coords);
      return;
    }

    coords.forEach(extractCoords);
  };

  extractCoords(geometry.coordinates);

  if (!allCoords.length) return { lat: 0, lng: 0 };

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  allCoords.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });

  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  };
};

const getCountryName = (polygon) => {
  return (
    polygon?.properties?.name ||
    polygon?.properties?.ADMIN ||
    polygon?.properties?.NAME ||
    "Nazione selezionata"
  );
};

const getCountryCode = (polygon) => {
  const rawCode =
    polygon?.properties?.iso_a2 ||
    polygon?.properties?.ISO_A2 ||
    polygon?.properties?.iso2 ||
    polygon?.properties?.ISO2 ||
    polygon?.properties?.iso_a3 ||
    polygon?.properties?.ISO_A3 ||
    "";

  const normalized = String(rawCode).trim().toLowerCase();

  const iso3ToIso2Map = {
    usa: "us",
    afg: "af",
    alb: "al",
    dza: "dz",
    and: "ad",
    ago: "ao",
    atg: "ag",
    arg: "ar",
    arm: "am",
    aus: "au",
    aut: "at",
    aze: "az",
    bhs: "bs",
    bhr: "bh",
    bgd: "bd",
    brb: "bb",
    bel: "be",
    blz: "bz",
    ben: "bj",
    btn: "bt",
    blr: "by",
    bol: "bo",
    bih: "ba",
    bwa: "bw",
    bra: "br",
    brn: "bn",
    bgr: "bg",
    bfa: "bf",
    bdi: "bi",
    cpv: "cv",
    khm: "kh",
    cmr: "cm",
    can: "ca",
    caf: "cf",
    tcd: "td",
    chl: "cl",
    chn: "cn",
    col: "co",
    com: "km",
    cog: "cg",
    cod: "cd",
    cri: "cr",
    civ: "ci",
    hrv: "hr",
    cub: "cu",
    cyp: "cy",
    cze: "cz",
    dnk: "dk",
    dma: "dm",
    dom: "do",
    ecu: "ec",
    egy: "eg",
    slv: "sv",
    are: "ae",
    eri: "er",
    est: "ee",
    swz: "sz",
    eth: "et",
    fji: "fj",
    phl: "ph",
    fin: "fi",
    fra: "fr",
    gab: "ga",
    gmb: "gm",
    geo: "ge",
    deu: "de",
    gha: "gh",
    jam: "jm",
    jpn: "jp",
    dji: "dj",
    jor: "jo",
    grc: "gr",
    grd: "gd",
    gtm: "gt",
    gin: "gn",
    gnb: "gw",
    gnq: "gq",
    guy: "gy",
    hti: "ht",
    hnd: "hn",
    ind: "in",
    idn: "id",
    irn: "ir",
    irq: "iq",
    irl: "ie",
    isl: "is",
    isr: "il",
    ita: "it",
    kaz: "kz",
    ken: "ke",
    kgz: "kg",
    kir: "ki",
    kwt: "kw",
    lao: "la",
    lso: "ls",
    lva: "lv",
    lbn: "lb",
    lbr: "lr",
    lby: "ly",
    lie: "li",
    ltu: "lt",
    lux: "lu",
    mdg: "mg",
    mwi: "mw",
    mys: "my",
    mdv: "mv",
    mli: "ml",
    mlt: "mt",
    mar: "ma",
    mhl: "mh",
    mrt: "mr",
    mus: "mu",
    mex: "mx",
    fsm: "fm",
    mda: "md",
    mco: "mc",
    mng: "mn",
    mne: "me",
    moz: "mz",
    mkd: "mk",
    mmr: "mm",
    nam: "na",
    nru: "nr",
    npl: "np",
    nic: "ni",
    ner: "ne",
    nga: "ng",
    nor: "no",
    nzl: "nz",
    omn: "om",
    nld: "nl",
    पाक: "pk",
    pak: "pk",
    plw: "pw",
    pan: "pa",
    png: "pg",
    pry: "py",
    per: "pe",
    pol: "pl",
    prt: "pt",
    qat: "qa",
    gbr: "gb",
    rou: "ro",
    rwa: "rw",
    rus: "ru",
    kna: "kn",
    lca: "lc",
    vct: "vc",
    slb: "sb",
    wsm: "ws",
    smr: "sm",
    stp: "st",
    sen: "sn",
    srb: "rs",
    syc: "sc",
    sle: "sl",
    sgp: "sg",
    syr: "sy",
    svk: "sk",
    svn: "si",
    som: "so",
    esp: "es",
    lka: "lk",
    zaf: "za",
    sdn: "sd",
    ssd: "ss",
    sur: "sr",
    swe: "se",
    che: "ch",
    tjk: "tj",
    tza: "tz",
    tha: "th",
    tls: "tl",
    tgo: "tg",
    ton: "to",
    tto: "tt",
    tun: "tn",
    tur: "tr",
    tkm: "tm",
    tuv: "tv",
    ukr: "ua",
    uga: "ug",
    hun: "hu",
    ury: "uy",
    uzb: "uz",
    vut: "vu",
    ven: "ve",
    vnm: "vn",
    yem: "ye",
    zmb: "zm",
    zwe: "zw",
    vat: "va",
    pse: "ps",
    xkx: "xk",
    prk: "kp",
    kor: "kr",
  };

  if (normalized.length === 2) return normalized;
  if (normalized.length === 3) return iso3ToIso2Map[normalized] || "";

  return "";
};

const GlobeViewer = ({
  isSpinning,
  pin,
  selectedCountryName,
  onCountryClick,
}) => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
        );

        setCountries(response.data.features || []);
      } catch (error) {
        console.error("Errore caricamento geojson:", error);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    globeRef.current.pointOfView({ altitude: 2.1 });

    const controls = globeRef.current.controls();

    controls.autoRotate = isSpinning;
    controls.autoRotateSpeed = 50;
    controls.enablePan = false;

    if (!isSpinning) {
      controls.autoRotate = false;
    }
  }, [isSpinning]);

  const pointsData = useMemo(() => {
    if (!pin) return [];
    return [pin];
  }, [pin]);

  return (
    <div className="globe-wrapper">
      <Globe
        ref={globeRef}
        width={900}
        height={580}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        polygonsData={countries}
        polygonAltitude={(polygon) => {
          const countryName = getCountryName(polygon);
          return countryName === selectedCountryName ? 0.025 : 0.01;
        }}
        polygonCapColor={(polygon) => {
          const countryName = getCountryName(polygon);
          return countryName === selectedCountryName
            ? "rgba(37,86,245,0.75)"
            : "rgba(255,255,255,0.05)";
        }}
        polygonSideColor={(polygon) => {
          const countryName = getCountryName(polygon);
          return countryName === selectedCountryName
            ? "rgba(37,86,245,0.35)"
            : "rgba(255,255,255,0.03)";
        }}
        polygonStrokeColor={(polygon) => {
          const countryName = getCountryName(polygon);
          return countryName === selectedCountryName
            ? "rgba(20,40,120,0.95)"
            : "rgba(255,255,255,0.18)";
        }}
        onPolygonClick={(polygon) => {
          const countryName = getCountryName(polygon);
          const countryCode = getCountryCode(polygon);
          const center = getPolygonCenter(polygon?.geometry);

          console.log("CLICK COUNTRY:", {
            countryName,
            countryCode,
            properties: polygon?.properties,
          });

          onCountryClick({
            countryName,
            countryCode,
            lat: center.lat,
            lng: center.lng,
          });
        }}
        polygonsTransitionDuration={250}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointRadius={0.6}
        pointAltitude={0.03}
        pointColor={() => "#ff4d4f"}
      />
    </div>
  );
};

export default GlobeViewer;
