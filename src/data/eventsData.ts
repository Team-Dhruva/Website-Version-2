export interface EventDetail {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  speaker?: string;
  speakerAffiliation?: string;
  date: string;
  time?: string;
  venue: string;
  aboutSection: string;
  aboutSpeaker?: string;
  registrationLink?: string;
  registrationStatus: "open" | "closed";
}

export const EVENTS: EventDetail[] = [
  {
    id: "einstein-lectures",
    title: "Einstein Lectures",
    subtitle: "The Six Faces of Subrahmanyan Chandrasekhar",
    description: "Explore the life and contributions of Chandrasekhar with Rajaram Nityananda.",
    speaker: "Rajaram Nityananda",
    speakerAffiliation: "ICTS-TIFR, Bengaluru",
    date: "October 29, 2024",
    time: "11:30 AM - 1:00 PM",
    venue: "TE Seminar Hall, R V College of Engineering, Bengaluru",
    aboutSection: "Subrahmanyan Chandrasekhar, born on October 19th, 1910, was one of the most influential astrophysicists of the 20th century. His career spanned multiple distinct phases, each marked by significant contributions, culminating in a published book. The first phase of his work, where he derived the limiting mass for white dwarfs, led to a Nobel Prize after a 50-year delay. This lecture will review the key moments of Chandrasekhar’s life, exploring his contributions across six distinct phases.",
    aboutSpeaker: "Rajaram Nityananda earned his PhD in physics from Bangalore University in 1977, focusing on optics and crystallography. He worked at the Raman Research Institute on astronomical optics and dynamics, later moving to the National Centre for Radio Astrophysics, Pune. He also taught physics at IISER-Pune and Azim Premji University. Currently at ICTS-TIFR, he works on radio imaging and gravitational lensing.",
    registrationLink: "https://bit.ly/ELoct2024",
    registrationStatus: "open"
  },
  {
    id: "astronomy-workshop",
    title: "Astronomy Workshop",
    subtitle: "Data Driven Astronomy Workshop",
    description: "Hands-on data manipulation, astronomy analysis, and machine learning using Python.",
    date: "October 23rd, 24th, and 25th",
    time: "4:45 PM - 6:30 PM",
    venue: "TE Seminar Hall, R V College of Engineering, Bengaluru (Offline)",
    aboutSection: "We are excited to invite you to our special astronomy workshop! Experience astronomy with hands-on activities, data-driven insights, and machine learning techniques using Python and Scikit-Learn. You will learn to manipulate and visualize cosmic datasets, stack photometric filters, and apply cutting-edge clustering and classification algorithms to real stellar data.",
    registrationLink: "https://forms.gle/aQjE4uRBP1RQCTCJ8",
    registrationStatus: "open"
  },
  {
    id: "stargazing-spectacles",
    title: "Stargazing Spectacles",
    subtitle: "An Evening Under the Stars",
    description: "Join us for an evening of observations through our in-house built 6-inch reflecting telescope.",
    date: "October 15, 2024",
    venue: "RVCE Campus Football Ground",
    aboutSection: "Join us for a stargazing night under the dark skies on campus. We will set up our custom, in-house built 6-inch Newtonian reflecting telescope (built from scratch using 3D printed components and PVC pipes). Participants will learn to identify major constellations, stars, and visible planets like Jupiter and Saturn, along with other deep-sky objects.",
    registrationStatus: "closed"
  }
];
