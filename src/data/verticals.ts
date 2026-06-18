export interface VerticalProject {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface VerticalData {
  name: string;
  slug: string;
  tagline: string;
  projects: VerticalProject[];
}

export const VERTICALS: VerticalData[] = [
  {
    name: "Radio Astronomy",
    slug: "radio",
    tagline:
      "Where we design, build, and operate our own radio telescopes, advancing both our skills and the field of radio astronomy through hands-on projects and meaningful research",
    projects: [
      {
        title: "Solar Radio Telescope",
        description: "A small-scale, affordable radio telescope built using a TV satellite dish to monitor and analyze dynamic activities in the Sun's chromosphere and the solar cycle.",
        image:
          "https://media.sciencephoto.com/image/r6140169/800wm/R6140169-Open_star_cluster_NGC_2451.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "H21 Horn Telescope",
        description: "A custom horn antenna and electronic receiver setup constructed from scratch to observe the neutral hydrogen 21 cm spectral line and map galactic rotation velocities.",
        image:
          "https://pswscience.org/wp-content/uploads/2018/08/ns_gw_art-1024x576.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Radio JOVE",
        description: "A specialized radio receiver setup to observe and record decametric radio emissions from Jupiter's magnetosphere and solar radio bursts.",
        image:
          "https://i1.wp.com/www.thephysicsmill.com/blog/wp-content/uploads/nanograv.jpeg?fit=1585%2C1189",
        link: "https://github.com/Team-Dhruva/website-main",
      },
    ],
  },
  {
    name: "Data Driven Astronomy",
    slug: "data",
    tagline:
      "Delve deep into mysteries of the universe and uncover secrets through analytics",
    projects: [
      {
        title: "Star Cluster Analysis",
        description: "Analyzing galaxy interactions and star clusters in colliding systems using advanced image processing, stacking, and photometric age estimation.",
        image:
          "https://media.sciencephoto.com/image/r6140169/800wm/R6140169-Open_star_cluster_NGC_2451.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Ligo",
        description: "Processing raw data from LIGO's gravitational wave interferometers, applying noise filters, and running matched-filtering algorithms to detect spacetime ripples.",
        image:
          "https://pswscience.org/wp-content/uploads/2018/08/ns_gw_art-1024x576.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Nanograv",
        description: "Analyzing millisecond pulsar timing perturbations using NanoGRAV dataset to detect low-frequency gravitational waves from supermassive black hole binaries.",
        image:
          "https://i1.wp.com/www.thephysicsmill.com/blog/wp-content/uploads/nanograv.jpeg?fit=1585%2C1189",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "GAIA",
        description: "Querying and analyzing GAIA space observatory astrometric data to study the 3D distribution, kinematics, and radial velocities of stars in the Milky Way.",
        image:
          "https://astrobiology.nasa.gov/uploads/filer_public_thumbnails/filer_public/48/5f/485fedff-acf9-4d62-b817-4ede5fcb0240/artist_s_impression_of_gaia.jpg__930x580_q85_crop_subject_location-465%2C290_subsampling-2.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "SLOAN",
        description: "Utilizing Sloan Digital Sky Survey (SDSS) multi-spectral photometric data and spectroscopic observations to explore galactic redshift and large-scale cosmic structure.",
        image:
          "https://sloan.org/storage/app/media/programs/science/SDSS/cropped-images/hero%20image%20sloan_telescope-0-182-1200-714-1462225014.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "ML for Exoplanet Detection",
        description: "Applying machine learning models like Random Forests and neural networks to Kepler and TESS light curve transit data to identify and confirm candidate exoplanets.",
        image:
          "https://exoplanets.nasa.gov/system/news_items/main_images/1467_mtwilson_main1600.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "DDAxResearchxRadio",
        description: "An interdisciplinary sub-vertical calibrating, cleaning, and integrating data from multiple radio telescopes to produce high-resolution astronomical images.",
        image:
          "https://static.vecteezy.com/system/resources/previews/022/506/726/large_2x/astronomy-deep-space-radio-telescope-arrays-at-night-pointing-into-space-free-photo.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Code(n)Stellation",
        description: "The club's annual astrophysics-themed hackathon and coding competition, focusing on astronomical computations, orbital simulation, and data analysis.",
        image:
          "https://gadget.co.za/wp-content/uploads/2019/10/9CF4815C-75ED-4CEA-8BBE-4798D49E9AD4.jpeg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Python Package/Product",
        description: "Developing custom open-source Python libraries for automating sky coordinate conversions, FITS file header processing, and light-curve filtering.",
        image:
          "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2023/04/raspberry-lanza-editor-codigo-aprender-python-lenguaje-ia-3008158.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
    ],
  },
  {
    name: "Optical Astronomy",
    slug: "optical",
    tagline: "Beauty lies in the eyes of the beholder.",
    projects: [
      {
        title: '10" Newtonian Reflector Telescope',
        description: "Designing and assembling a high-aperture 10-inch Newtonian reflector telescope on an automated equatorial mount for high-resolution planetary observations.",
        image:
          "https://media.sciencephoto.com/image/r6140169/800wm/R6140169-Open_star_cluster_NGC_2451.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: '6" Reflector Newtonian Telescope',
        description: "A 6-inch Newtonian reflector built from scratch using 3D printed components and PVC tubes, optimized for lunar, Saturnian, and Jovian sky watching sessions.",
        image:
          "https://pswscience.org/wp-content/uploads/2018/08/ns_gw_art-1024x576.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Project Ballman",
        description: "A high-altitude near-space balloon mission launched to an altitude of 30 km to explore cosmic rays, atmospheric conductivity, and solar irradiance.",
        image:
          "https://i1.wp.com/www.thephysicsmill.com/blog/wp-content/uploads/nanograv.jpeg?fit=1585%2C1189",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Astrophotography",
        description: "Capturing details of nebula, star clusters, and planets using a modular setup with Raspberry Pi camera sensors, automated tracking, and stacking software.",
        image:
          "https://astrobiology.nasa.gov/uploads/filer_public_thumbnails/filer_public/48/5f/485fedff-acf9-4d62-b817-4ede5fcb0240/artist_s_impression_of_gaia.jpg__930x580_q85_crop_subject_location-465%2C290_subsampling-2.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Optical Research",
        description: "Analyzing aberration patterns in various optical glass materials and testing multi-lens refracting configurations for atmospheric correction.",
        image:
          "https://sloan.org/storage/app/media/programs/science/SDSS/cropped-images/hero%20image%20sloan_telescope-0-182-1200-714-1462225014.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
    ],
  },
  {
    name: "Research",
    slug: "research",
    tagline:
      "Delve deep into mysteries of the universe and uncover secrets through analytics",
    projects: [
      {
        title: "Blogs",
        description: "Sharing observational write-ups, stargazing logs, and reviews of astronomical events with the wider student and amateur astronomy community.",
        image:
          "https://media.sciencephoto.com/image/r6140169/800wm/R6140169-Open_star_cluster_NGC_2451.jpg",
        link: "/blog",
      },
      {
        title: "Journal",
        description: "Our periodic research publication containing detailed student abstracts, calculations on stellar dynamics, and summaries of space missions.",
        image:
          "https://pswscience.org/wp-content/uploads/2018/08/ns_gw_art-1024x576.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Mathematical Astrophysics",
        description: "Studying the mathematical formulations of cosmic expansion, Schwarzschild black hole metrics, and radiative transfer inside stellar interiors.",
        image:
          "https://i1.wp.com/www.thephysicsmill.com/blog/wp-content/uploads/nanograv.jpeg?fit=1585%2C1189",
        link: "https://github.com/Team-Dhruva/website-main",
      },
      {
        title: "Indian Astrophysics",
        description: "Documenting historical astronomical landmarks in India, and reviewing current ISRO space observatories like Astrosat and Aditya-L1.",
        image:
          "https://astrobiology.nasa.gov/uploads/filer_public_thumbnails/filer_public/48/5f/485fedff-acf9-4d62-b817-4ede5fcb0240/artist_s_impression_of_gaia.jpg__930x580_q85_crop_subject_location-465%2C290_subsampling-2.jpg",
        link: "#indian-astrophysics",
      },
      {
        title: "Optical Research",
        description: "Formulating computer models to predict diffraction-limited focusing parameters of customized reflecting telescopes under varying atmospheric turbulences.",
        image:
          "https://sloan.org/storage/app/media/programs/science/SDSS/cropped-images/hero%20image%20sloan_telescope-0-182-1200-714-1462225014.jpg",
        link: "https://github.com/Team-Dhruva/website-main",
      },
    ],
  },
];

