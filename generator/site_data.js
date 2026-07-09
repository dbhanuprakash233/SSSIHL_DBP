const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------
// Course + faculty data (single source of truth for the site)
// ---------------------------------------------------------------
const FACULTY = {
  name: "Prof. Richard A. Whitfield, Ph.D.",
  initials: "RW",
  role: "Associate Professor, Department of Data Science",
  email: "richard.whitfield@meridian.edu",
  office: "Room 412, Data Science Block",
  phone: "+1 (555) 214-7890",
  term: "Semester V — Academic Year 2026–27"
};

const UNI = {
  name: "Meridian State University",
  dept: "Department of Data Science",
  school: "School of Engineering & Applied Sciences",
  address: "1200 Ridgeview Avenue, Lakeshore Campus, Meridian City, ST 45021",
  phone: "+1 (555) 214-7890",
  email: "dds@meridian.edu",
  web: "www.meridian.edu/datascience"
};

const UNIT_COLORS = ["#1F3864", "#3B5C94", "#B08D57", "#6C8CBF", "#8A6D3B", "#4F6D8C"];

const courses = [
  {
    slug: "optimization-techniques",
    num: 1,
    title: "Optimization Techniques",
    code: "UMAT-503",
    category: "DSC (Discipline Specific Core)",
    ltpc: "4-0-0-4",
    totalPeriods: 56,
    prerequisites: "Calculus",
    prereqLinks: [
      { title: "Khan Academy — Calculus 1", url: "https://www.khanacademy.org/math/calculus-1", desc: "Limits, derivatives and applications — refresh before Unit 1." },
      { title: "MIT OCW — Single Variable Calculus", url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/", desc: "Full lecture notes and problem sets." }
    ],
    objectives: [
      "Introduce the students to the mathematical formulation of optimization.",
      "Expose the students to a spectrum of optimization techniques and their applicability."
    ],
    outcomes: [
      "Apply mathematical skills to model optimization problems.",
      "Critically analyse theoretical principles and choose the relevant optimization techniques for a specific problem.",
      "Get exposed to solutions for various types of optimization problems and be enabled to adopt them for the situation at hand."
    ],
    units: [
      { unit: 1, topic: "Mathematical Review", periods: 8 },
      { unit: 2, topic: "Unconstrained Optimization", periods: 12 },
      { unit: 3, topic: "Modelling with Linear Programming", periods: 16 },
      { unit: 4, topic: "Non-Linear Constrained Optimization", periods: 12 },
      { unit: 5, topic: "Convex Optimization Problems", periods: 8 }
    ],
    keyTexts: [
      "Edwin K. P. Chong and Stanislaw H. Zak, An Introduction to Optimization, 4th edition, Wiley (2013).",
      "Hamdy A. Taha, Operations Research, 9th edition, Pearson (2014)."
    ],
    suggestedReadings: [
      "L.R. Foulds, Optimization Techniques, Springer, UTM, 1981.",
      "Boyd & Vandenberghe, Convex Optimization, Cambridge University Press, 2004."
    ]
  },
  {
    slug: "data-analysis-visualization",
    num: 2,
    title: "Data Analysis and Visualization",
    code: "UDS-402",
    category: "OE (Open Elective)",
    ltpc: "3-0-1-4",
    totalPeriods: 70,
    prerequisites: "Basic Python/R",
    prereqLinks: [
      { title: "Python.org — Beginner's Guide", url: "https://www.python.org/about/gettingstarted/", desc: "Official getting-started guide for Python." },
      { title: "swirl (R programming, in R)", url: "https://swirlstats.com/", desc: "Interactive R fundamentals refresher." }
    ],
    objectives: ["This course provides an introduction to Data Analysis and Visualization Techniques."],
    outcomes: [
      "Make inferences from the data.",
      "Preprocess the data using a programming language.",
      "Make storytelling using visualization tools.",
      "Distinguish qualitative and quantitative data.",
      "Make inferences out of different plots.",
      "Develop a story out of the data."
    ],
    units: [
      { unit: 1, topic: "Data Preparation Techniques", periods: 8 },
      { unit: 2, topic: "Data Wrangling", periods: 10 },
      { unit: 3, topic: "Foundations in Graphs", periods: 12 },
      { unit: 4, topic: "Advanced Concepts in Data Visualization", periods: 12 }
    ],
    practicals: [
      { unit: 1, topic: "Usage of Data Analysis and Visualization Tools", periods: 8 },
      { unit: 2, topic: "Case Studies", periods: 20 }
    ],
    keyTexts: [
      "Jason Brownlee, Data Preparation For Machine Learning, Machine Learning Mastery, 2020.",
      "Rattenbury, Hellerstein, Heer, Kandel & Carreras, Principles of Data Wrangling, O'Reilly, 2017.",
      "Stephen Few, Show Me the Numbers, 2nd Edition, Analytics Press, 2012."
    ],
    suggestedReadings: []
  },
  {
    slug: "optimization-for-machine-learning",
    num: 3,
    title: "Optimization for Machine Learning",
    code: "UDSC-501",
    category: "IDM (Interdisciplinary Minor)",
    ltpc: "3-0-2-4",
    totalPeriods: 70,
    prerequisites: "10+2 Mathematics, Python programming, Calculus, Probability and Statistics",
    prereqLinks: [
      { title: "Khan Academy — Calculus 1", url: "https://www.khanacademy.org/math/calculus-1", desc: "Limits, derivatives and applications." },
      { title: "Python.org — Beginner's Guide", url: "https://www.python.org/about/gettingstarted/", desc: "Official Python getting-started guide." },
      { title: "Khan Academy — Statistics & Probability", url: "https://www.khanacademy.org/math/statistics-probability", desc: "Foundational probability & stats refresher." }
    ],
    objectives: [
      "Modeling and discussion of documented real-world applications.",
      "Study of mathematical programming algorithms for optimization.",
      "Apply the mathematical results and numerical techniques of optimization theory to concrete engineering problems."
    ],
    outcomes: [
      "Discover, study and solve optimization problems.",
      "Investigate, develop and promote innovative solutions for various applications.",
      "Apply mathematical skills to model optimization problems.",
      "Critically analyze theoretical principles and choose the relevant technique for a specific problem.",
      "Get exposed to solutions for various types of optimization problems."
    ],
    units: [
      { unit: 1, topic: "Introduction — Mathematical Review", periods: 6 },
      { unit: 2, topic: "Unconstrained Optimization", periods: 8 },
      { unit: 3, topic: "Linear Programming", periods: 8 },
      { unit: 4, topic: "Non-Linear Constrained Optimization", periods: 8 },
      { unit: 5, topic: "Convex Optimization", periods: 6 },
      { unit: 6, topic: "Machine Learning View for Optimization", periods: 6 }
    ],
    practicals: [
      { unit: 1, topic: "Unconstrained Optimization (Python implementation)", periods: 10 },
      { unit: 2, topic: "Solving LPP (Excel Solver & scipy.optimize.linprog)", periods: 10 },
      { unit: 3, topic: "Python Library scipy.optimize", periods: 8 }
    ],
    keyTexts: [
      "Edwin K. P. Chong and Stanislaw H. Zak, An Introduction to Optimization, 4th Edition, Wiley (2013).",
      "Hamdy A. Taha, Operations Research – An Introduction, 10th Edition, Pearson (2017)."
    ],
    suggestedReadings: [
      "SciPy Reference Guide — docs.scipy.org",
      "Christian Hill, Learning Scientific Programming with Python, 2nd Edition, CUP, 2020."
    ]
  },
  {
    slug: "probability-and-statistics",
    num: 4,
    title: "Probability and Statistics",
    code: "UDSC-4xx",
    codeNote: true,
    category: "IDM (Interdisciplinary Minor)",
    ltpc: "3-1-0-4",
    totalPeriods: 56,
    prerequisites: "Differential and Integral Calculus",
    prereqLinks: [
      { title: "Khan Academy — Calculus 1 & 2", url: "https://www.khanacademy.org/math/calculus-1", desc: "Differential and integral calculus refresher." },
      { title: "MIT OCW — Calculus", url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/", desc: "Full course notes and problem sets." }
    ],
    objectives: [
      "Probability and Statistics is the branch of mathematics that deals with modeling uncertainty, with direct application in computer science, finance and telecommunications. This course provides students with a formal treatment of probability and statistics."
    ],
    outcomes: [
      "Solve real-world problems based on axioms of probability, conditional probability and Bayes' theorem.",
      "Understand several discrete and continuous random variables.",
      "Compute covariance and correlation, and identify statistical distributions from real datasets.",
      "Compute the moment-generating function for a given random variable.",
      "Plot histograms, box plots and scatter diagrams for univariate/bivariate data."
    ],
    units: [
      { unit: 1, topic: "Elements of Probability", periods: 12 },
      { unit: 2, topic: "Discrete Random Variables", periods: 12 },
      { unit: 3, topic: "Continuous Random Variables", periods: 14 },
      { unit: 4, topic: "Joint Probability Distributions", periods: 12 },
      { unit: 5, topic: "Descriptive Statistics", periods: 6 }
    ],
    keyTexts: ["Montgomery & Runger, Applied Statistics and Probability for Engineers, 7th Edition, Wiley, 2018 (Chapters 2–6)."],
    suggestedReadings: [
      "Sheldon M. Ross, Introduction to Probability and Statistics for Engineers and Scientists, 6th Edition, 2020.",
      "Miller & Miller, John E. Freund's Mathematical Statistics with Applications, 8th Edition, Pearson."
    ]
  }
];

module.exports = { FACULTY, UNI, UNIT_COLORS, courses };
