export interface Chapter {
  id: string;
  title: string;
  markdown: string;
}

export interface IAArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  lastUpdated?: string;
  chapters: Chapter[];
}

export const IA_ARTICLES: IAArticle[] = [
  {
    id: "nakshatra",
    title: "Nakshatra",
    description: "Explore the ancient Indian system of lunar mansions and their astronomical significance.",
    author: "Pranati Rao, Nithyashree S | Editor: Deepthi Prasad",
    lastUpdated: "May 9, 2025",
    chapters: [
      {
        id: "intro-to-nakshatras",
        title: "A1: An Introduction to Nakshatras",
        markdown: `May 9, 2025

For as long as humans have gazed at the night sky, we’ve been fascinated by the starry patterns that stretch across it. The people of ancient India noticed certain groups of stars that appeared together and reappeared at the same time each year. These repeating patterns sparked a need to organise the sky, leading to the creation of a system called nakshatras - regions marked by a grouping of specific stars.

The moon’s path across the sky was interpreted as a journey through 27 different nakshatras, and ancient astronomers used these patterns to trace the passage of time, thereby gaining the ability to predict seasons, and plan essential activities like planting of crops. By dividing the sky in this manner, they were able to turn a seemingly random collection of white dots in the sky into a structured, predictable system that helped connect the movements of the cosmos to life on Earth.

Their observations suggested that it takes the Moon a little more than 27 days to have the exact same backdrop of stars again. We now know that the period of orbit of the Moon around the Earth is 27 days, 7 hours and 43 minutes. Rounding down to 27, we can thus say that the nakshatra of any particular day is the major star cluster, identified by ancient Indians, acting as the backdrop of the Moon on the night sky of that day.

To create a systematic way of tracking the Moon's movement, the astronomers divided the entire path of the Moon (the 360-degree space) into 27 equal segments. Each nakshatra thus occupies exactly 13 degrees 20 minutes of the celestial arc. This precise mathematical division shows remarkable astronomical sophistication - considering the tools available at the time, their calculations came very close to mapping the actual lunar orbit.

Interestingly, ancient astronomers grouped these stars based on thoughtful criteria like brightness, visibility, and their position along the Moon’s path in the sky. While some nakshatras align with well-known constellations, where stars form distinctive arrangements (like Orion), others don’t form such perfect shapes. Each Nakshatra holds its own unique significance, contributing a distinct influence within the cosmic order. Together, they form a celestial framework that has guided traditions, beliefs, and observations for millennia.

The 27 nakshatras are -

| _1\\. Ashvini_ | _10\\. Magha_ | _19\\. Mula_ |
| --- | --- | --- |
| _2\\. Bharani_ | _11\\. Purva Phalguni_ | _20\\. Purva Ashada_ |
| _3\\. Krittika_ | _12\\. Uttara Phalguni_ | _21\\. Uttara Ashada_ |
| _4\\. Rohini_ | _13\\. Hasta_ | _22\\. Shravana_ |
| _5\\. Mrigashira_ | _14\\. Chitra_ | _23\\. Dhanishta_ |
| _6\\. Ardra_ | _15\\. Swati_ | _24\\. Shatabhisha_ |
| _7\\. Punarvasu_ | _16\\. Vishakha_ | _25\\. Purva Bhadrapada_ |
| _8\\. Pushya_ | _17\\. Anuradha_ | _26\\. Uttara Bhadrapada_ |
| _9\\. Ashlesha_ | _18\\. Jyeshta_ | _27\\. Revati_ |

**(Edited by Deepthi Prasad, IA Lead)**`
      },
      {
        id: "astronomical-relevance",
        title: "A2: The Astronomical Relevance of Nakshatras",
        markdown: `May 9, 2025

What did people use to check the time and day back when electronic addons (gadgets) weren't the norm? How did they keep track of important days? Or how far away was the next storm? We go back in time to the analog watches, mechanical clocks, hour glasses, water clocks, sundials which would have given the approximate time reminding people to go about their day. But the answer surprisingly is looking up into the night sky!!!

The day you were born, the moon would have been in a particular _Nakshatra_ and every year when the sun returns to the same _Nakshatra_ It’s your birthday again!!! This is how ancient Indians determined important dates. Now some might say “_Nakshatra_ what’s that?” Well, it’s only one of the most interesting aspects in Indian Astronomy. The ecliptic (the path followed by the sky throughout the year) is divided into 27 divisions and each division has a prominent star or asterism using which it is identified. This is known as the _Nakshatra_ (As mentioned in article A1: Introduction to Nakshatras)

Ever wondered what it would be like to time travel back to ancient India? So, let’s delve deep into _Nakshatras_ and how they'd help you survive this. The Sidereal /Solar year is the sun starting its Journey from the first _Nakshatra;_ _Aswini_ (Beta /Gamma Arities) and returning back to _Aswini_ travelling through the path of the ecliptic and that's how crop cycles and changing seasons were determined.

Now if we wish to explore and observe the night skies there's nothing better than considering the perspective of the holy _Annadata_ (farmer). So how did they know when to sow and when to reap? Agriculture depending on _Nakshatras_ for the auspicious time for sowing etc is considered superstitious but it’s actually a way of determining the perfect climate by tracking the time of the year. Certain _Nakshatras_ were and are still associated with the onset of rainfall and sowing season. _Punarvasu Nakshatra_ got the highest rainfall and was best suited for sowing followed by _Pushya_, whereas _Swathi_ was linked to cool breezes and _Kritika_ was associated with spring.

To say our ancestors were knowledgeable is an understatement. There exists evidence that the Harappan civilization used _Nakshatras_ for time keeping and for determining directions for town planning. Representative seals were found in the area which provides proof of their profound knowledge of the _Nakshatras_.

The _Saptarshi_ constellation or our modern Ursa Major has been used throughout texts like _Vishnu puran_ and _Mahabharata_ in identifying various eras. _Saptarishi_ spans the _Nakshatras_ for varying amounts of time in the range of hundreds of years. Hence tracking _Saptharishi_ along with the star at the then pole (note that it’s not a pole star because the precession of earth’s axis causes fixed pole stars to change) one can determine the era of the event happening.

Texts like _Mahabharata_ describe the positions of nakshatras, planets, constellations, other heavenly bodies like comets and occurrences like eclipses in a particular nakshatra. While it’s superstitious to believe that these mentions stand solely for the omens they stand for, using astronomical calculations the time period of these occurrences can be significantly narrowed down thereby giving you the time of occurrence of historical events.

It’s remarkable how a handful of tiny lights in the night sky have witnessed Earth's ever-changing story, all while undergoing transformations of their own.

**(Edited by Deepthi Prasad, IA Lead)**`
      }
    ]
  },
  {
    id: "stellarium-research",
    title: "Stellarium Research",
    description: "Modern computational research using Stellarium software to validate ancient observations.",
    author: "Dr. Dhruva | Editor: Deepthi Prasad",
    chapters: []
  },
  {
    id: "ancient-observatories",
    title: "Ancient Observatories",
    description: "Discover the architectural marvels of ancient Indian astronomical observatories.",
    author: "Dr. Dhruva | Editor: Deepthi Prasad",
    chapters: []
  },
  {
    id: "modern-indian-astronomy",
    title: "Modern Indian Astronomy",
    description: "India's contributions to contemporary astrophysics and space exploration.",
    author: "Dr. Dhruva | Editor: Deepthi Prasad",
    chapters: []
  }
];
