import type { Mode } from "./logic";

export type Puzzle = {
  /** Exactly PUZZLE_LENGTH unique characters: digits for numbers, UPPERCASE letters for words. */
  answer: string;
  clue: string;
  /** Shown once the round is over. */
  explanation?: string;
};

export const NUMBER_PUZZLES: Puzzle[] = [
  {
    answer: "10958",
    clue: "Approximately how many days are there in 30 years?",
    explanation: "30 × 365 = 10,950, plus roughly 8 leap days.",
  },
  {
    answer: "17280",
    clue: "How many minutes are in 12 days?",
    explanation: "12 × 24 × 60 = 17,280.",
  },
  {
    answer: "17520",
    clue: "How many hours are in two non-leap years?",
    explanation: "2 × 365 × 24 = 17,520.",
  },
  {
    answer: "43560",
    clue: "How many square feet make up one acre?",
  },
  {
    answer: "42195",
    clue: "How many meters long is an official marathon?",
    explanation: "26 miles 385 yards, or 42.195 km.",
  },
  {
    answer: "27315",
    clue: "Absolute zero in Celsius, with the minus sign and decimal point removed.",
    explanation: "−273.15 °C is 0 kelvin.",
  },
  {
    answer: "12756",
    clue: "Earth's diameter at the equator, in kilometers (rounded).",
    explanation: "About 12,756 km.",
  },
  {
    answer: "35786",
    clue: "A geostationary satellite orbits this many kilometers above the equator.",
    explanation: "At 35,786 km, one orbit takes exactly one Earth day.",
  },
  {
    answer: "24901",
    clue: "Earth's circumference around the equator, in miles (rounded).",
  },
  {
    answer: "32768",
    clue: "2 to the power of 15.",
    explanation: "One more than the largest signed 16-bit integer, 32,767.",
  },
  {
    answer: "16384",
    clue: "2 to the power of 14, or the number of bytes in 16 KiB.",
  },
  {
    answer: "20736",
    clue: "12 to the fourth power.",
    explanation: "12⁴ = 144² = 20,736.",
  },
  {
    answer: "78125",
    clue: "5 to the seventh power.",
  },
  {
    answer: "19683",
    clue: "3 to the ninth power.",
  },
  {
    answer: "16807",
    clue: "7 to the fifth power.",
  },
  {
    answer: "28561",
    clue: "13 to the fourth power.",
    explanation: "13² = 169, and 169² = 28,561.",
  },
  {
    answer: "49152",
    clue: "How many bytes are in 48 kibibytes (48 × 1,024)?",
  },
  {
    answer: "61453",
    clue: "The hex value F00D, converted to decimal.",
    explanation: "15 × 4096 + 0 × 256 + 0 × 16 + 13 = 61,453.",
  },
  {
    answer: "47806",
    clue: "The hex value BABE, converted to decimal.",
    explanation: "11 × 4096 + 10 × 256 + 11 × 16 + 14 = 47,806.",
  },
  {
    answer: "12345",
    clue: "Five digits counting up from one: the classic worst password.",
  },
  {
    answer: "10234",
    clue: "The smallest five-digit number with no repeated digit.",
  },
  {
    answer: "98765",
    clue: "The largest five-digit number with no repeated digit.",
  },
];

export const WORD_PUZZLES: Puzzle[] = [
  { answer: "DEBUG", clue: "Hunt down and fix the flaws hiding in your code." },
  {
    answer: "BUILD",
    clue: "What a CI pipeline runs to turn source code into something shippable.",
  },
  { answer: "PARSE", clue: "Break text into structured pieces a program can understand." },
  { answer: "STACK", clue: "Last in, first out." },
  { answer: "QUERY", clue: "A question you ask a database." },
  { answer: "PROXY", clue: "A server that makes requests on someone else's behalf." },
  { answer: "TOKEN", clue: "A short string that proves who you are to an API." },
  { answer: "ROUTE", clue: "The path a request follows to reach its handler." },
  { answer: "GRAPH", clue: "Nodes connected by edges." },
  { answer: "TUPLE", clue: "A fixed-size, ordered collection, as in Python." },
  { answer: "THROW", clue: "What you do to raise an exception." },
  { answer: "BYTES", clue: "Eight bits make one of these." },
  { answer: "CLOUD", clue: "Other people's computers, rented by the hour." },
  { answer: "LINUX", clue: "Open-source kernel named after its creator, Linus." },
  { answer: "PIXEL", clue: "The smallest dot on a screen." },
  { answer: "MOUSE", clue: "A pointing device you click, named after a rodent." },
  { answer: "BRAIN", clue: "The organ you're using to solve this." },
  { answer: "LIGHT", clue: "Travels about 300,000 kilometers every second." },
  { answer: "EARTH", clue: "The third planet from the Sun." },
  { answer: "MANGO", clue: "Tropical stone fruit, often called the king of fruits." },
  { answer: "LEMON", clue: "A sour yellow citrus fruit." },
  { answer: "GRAPE", clue: "Wine starts out as one of these." },
  { answer: "PIANO", clue: "Eighty-eight black and white keys." },
  { answer: "NIGHT", clue: "When your side of the planet faces away from the Sun." },
  { answer: "TIGER", clue: "The largest wild cat, known for its stripes." },
  { answer: "ZEBRA", clue: "Striped, horse-like animal of the African savanna." },
  { answer: "SPICE", clue: "Cinnamon, cumin and saffron all count as this." },
  { answer: "BREAD", clue: "Baked from flour, water and yeast." },
  { answer: "PLANT", clue: "It grows from a seed and makes food from sunlight." },
  { answer: "FLAME", clue: "The visible, glowing part of a fire." },
  { answer: "WATCH", clue: "A timepiece worn on the wrist." },
  { answer: "SCARF", clue: "Wrapped around the neck in winter." },
  { answer: "GLOBE", clue: "A spherical map of the Earth." },
  { answer: "SMILE", clue: "The upturned curve of a happy mouth." },
];

export const PUZZLES: Record<Mode, Puzzle[]> = {
  number: NUMBER_PUZZLES,
  word: WORD_PUZZLES,
};
