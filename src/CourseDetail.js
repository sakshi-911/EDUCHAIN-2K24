import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { jsPDF } from "jspdf";
import "./CourseDetail.css";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseStarted, setCourseStarted] = useState(false);
  const [rewardAdded, setRewardAdded] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          console.log(accounts);
          setAccount(accounts[0]);

          const contractAddress = JSON.parse(localStorage.getItem("userData"))[
            "walletAddress"
          ]; // recepient,s address to be set
          const contractABI = [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address payable",
                  name: "_to",
                  type: "address",
                },
              ],
              name: "transfer",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
          ];

          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Failed to load web3, accounts, or contract.", error);
        }
      }
    };

    initWeb3();
  }, []);

  const dataa = [
    {
      name: "Introduction to Python Programming",
      introduction:
        "Learn the basics of Python programming in this comprehensive course. You'll start with fundamental concepts such as data types, control structures, and functions. The course includes hands-on exercises and real-world examples to help you grasp Python's syntax and features. As you progress, you'll work on projects that involve data manipulation, file handling, and basic algorithm design. By the end of the course, you'll be able to write simple Python programs and understand the principles of programming.",
      curriculum: [
        "Introduction to Python",
        "Data Types and Variables",
        "Control Structures (Loops, Conditionals)",
        "Functions and Modules",
        "File Handling",
        "Error Handling",
        "Basic Algorithms",
        "Project: Building a Simple Python Application",
      ],
      duration: "6 weeks",
      benefits: [
        "Gain proficiency in Python programming",
        "Develop problem-solving skills",
        "Build foundational programming knowledge",
        "Prepare for advanced Python courses",
      ],
      instructor: "Emily Davis",
      rewardPoints: 50,
      image:
        "data:image/png;base64,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",
    },
    {
      name: "Web Development with HTML, CSS, and JavaScript",
      introduction:
        "This course introduces web development by covering HTML, CSS, and JavaScript. You'll learn how to create responsive web pages, style them using CSS, and add interactivity with JavaScript. The curriculum includes practical exercises to build and enhance your web development skills. You'll work on projects that involve creating websites from scratch, ensuring that you gain hands-on experience in front-end development. By the end of the course, you'll be able to build and deploy functional websites.",
      curriculum: [
        "Introduction to HTML",
        "CSS Basics and Advanced Styling",
        "JavaScript Fundamentals",
        "Responsive Web Design",
        "Web Development Tools and Frameworks",
        "Project: Creating a Complete Website",
        "Debugging and Optimization",
        "Final Project",
      ],
      duration: "8 weeks",
      benefits: [
        "Develop a strong foundation in web development",
        "Create responsive and interactive websites",
        "Gain practical experience with HTML, CSS, and JavaScript",
        "Prepare for web development roles",
      ],
      instructor: "Michael Brown",
      rewardPoints: 60,
      image:
        "https://miro.medium.com/v2/resize:fit:1400/1*IkTjQmOjKHNq4VCwhkNQfQ.png",
    },
    {
      name: "Data Science with R",
      introduction:
        "Explore the world of data science using R programming in this course. You'll learn to analyze and visualize data, perform statistical analysis, and use R's powerful libraries for data manipulation. The curriculum covers essential data science techniques, including data cleaning, exploratory data analysis, and machine learning basics. You'll work on projects that involve real-world datasets, gaining hands-on experience in data science workflows. By the end of the course, you'll be capable of conducting data analysis and interpreting results effectively.",
      curriculum: [
        "Introduction to R Programming",
        "Data Manipulation with dplyr",
        "Data Visualization with ggplot2",
        "Statistical Analysis",
        "Exploratory Data Analysis",
        "Introduction to Machine Learning",
        "Data Science Projects",
        "Final Project",
      ],
      duration: "9 weeks",
      benefits: [
        "Gain expertise in data science with R",
        "Develop skills in data manipulation and visualization",
        "Apply statistical analysis techniques",
        "Prepare for data science roles",
      ],
      instructor: "Jessica Wilson",
      rewardPoints: 70,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlibPB-tjkrIjdOf29c-aHs6swfrg3PJnu-g&s",
    },
    {
      name: "JavaScript and Advanced Front-End Development",
      introduction:
        "Dive deep into JavaScript and advanced front-end development with this course. You'll master JavaScript's advanced features and techniques, including asynchronous programming and modern frameworks like React and Vue.js. The curriculum includes hands-on projects to build dynamic web applications, optimize performance, and apply best practices. By the end of the course, you'll be skilled in developing complex front-end applications and preparing for advanced development roles.",
      curriculum: [
        "Advanced JavaScript Concepts",
        "Asynchronous Programming",
        "Front-End Frameworks (React, Vue.js)",
        "Performance Optimization",
        "State Management",
        "UI/UX Design Principles",
        "Testing and Debugging",
        "Final Project",
      ],
      duration: "10 weeks",
      benefits: [
        "Master advanced JavaScript features",
        "Build dynamic and high-performance web applications",
        "Gain experience with modern frameworks",
        "Prepare for advanced development roles",
      ],
      instructor: "Sophia Johnson",
      rewardPoints: 80,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoWYQ5NF343vH56HuVizlxZ3GspUL4bOa7IA&s",
    },
    {
      name: "Mobile App Development",
      introduction:
        "Learn to develop mobile applications for both Android and iOS platforms. This course covers key topics such as user interface design, mobile app architecture, and development frameworks. You'll use tools like Android Studio and Xcode to create apps and integrate APIs for added functionality. The curriculum includes real-world projects that help you understand mobile app development processes and best practices. By the end of the course, you'll be capable of building and deploying mobile apps to major app stores.",
      curriculum: [
        "Introduction to Mobile App Development",
        "UI/UX Design for Mobile Apps",
        "Android Development with Kotlin",
        "iOS Development with Swift",
        "Mobile App Architecture",
        "API Integration",
        "Testing and Debugging",
        "Publishing Apps",
      ],
      duration: "12 weeks",
      benefits: [
        "Develop cross-platform mobile applications",
        "Understand UI/UX design principles for mobile",
        "Integrate third-party APIs",
        "Deploy apps to Android and iOS app stores",
      ],
      instructor: "Robert Anderson",
      rewardPoints: 90,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBn66FWrM514KUXRpYCDXGaksQFS3lwywchQ&s",
    },
    {
      name: "Software Engineering Principles",
      introduction:
        "Explore key principles of software engineering in this comprehensive course. You'll learn about software development methodologies, project management, and quality assurance. The curriculum covers topics such as software lifecycle models, agile development, and design patterns. You'll also work on real-world projects to practice software design, implementation, and testing. By mastering these principles, you'll be equipped to lead software projects and ensure high-quality software delivery.",
      curriculum: [
        "Introduction to Software Engineering",
        "Software Development Lifecycle Models",
        "Agile and Scrum Methodologies",
        "Design Patterns",
        "Project Management",
        "Quality Assurance and Testing",
        "Software Maintenance",
        "Final Project",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand software engineering principles",
        "Apply best practices in software development",
        "Manage software projects effectively",
        "Ensure software quality and reliability",
      ],
      instructor: "Olivia Taylor",
      rewardPoints: 75,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNP28X7E9aFSKrOUj5mpv1VLw2A7C0yVkcOQ&s",
    },
    {
      name: "Artificial Intelligence Basics",
      introduction:
        "Get introduced to the world of artificial intelligence with this course. You'll cover fundamental AI concepts, including machine learning, neural networks, and natural language processing. The curriculum includes practical applications and tools used in AI development. You'll also work on projects that involve creating and training AI models. By the end of the course, you'll have a foundational understanding of AI and be prepared for more advanced studies in this rapidly growing field.",
      curriculum: [
        "Introduction to AI",
        "Machine Learning Fundamentals",
        "Neural Networks and Deep Learning",
        "Natural Language Processing",
        "AI Tools and Libraries",
        "Practical AI Projects",
        "Ethics in AI",
        "Future Trends in AI",
      ],
      duration: "9 weeks",
      benefits: [
        "Understand core AI concepts",
        "Develop and train AI models",
        "Explore real-world applications of AI",
        "Prepare for advanced AI courses",
      ],
      instructor: "Daniel Martinez",
      rewardPoints: 85,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt-A7COU40d8xGSGdVb-WaKpAVcEv3SLXbJA&s",
    },
    {
      name: "Operating Systems Fundamentals",
      introduction:
        "This course covers the core concepts of operating systems, including process management, memory management, and file systems. You'll learn about different operating system architectures and their components. The curriculum includes hands-on labs that simulate real-world scenarios and demonstrate how operating systems handle tasks. By understanding operating systems' fundamentals, you'll gain insights into how software and hardware interact and improve your problem-solving skills related to system-level issues.",
      curriculum: [
        "Introduction to Operating Systems",
        "Process Management",
        "Memory Management",
        "File Systems",
        "I/O Systems",
        "Operating System Architectures",
        "System Calls and APIs",
        "Hands-on Labs",
      ],
      duration: "7 weeks",
      benefits: [
        "Understand how operating systems work",
        "Gain practical experience with OS concepts",
        "Improve problem-solving skills for system-level issues",
        "Prepare for advanced OS-related topics",
      ],
      instructor: "Ethan Harris",
      rewardPoints: 65,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST8EMMP61qjiKjPN26q8ia6WGoK11ntBKKWg&s",
    },
    {
      name: "Database Management Systems",
      introduction:
        "Learn about database management systems (DBMS) and their role in storing, organizing, and retrieving data. This course covers database design, normalization, and SQL querying. You'll work on projects involving database creation, data manipulation, and query optimization. The curriculum also includes an introduction to NoSQL databases and their use cases. By mastering DBMS concepts, you'll be prepared to design and manage databases effectively for various applications.",
      curriculum: [
        "Introduction to DBMS",
        "Database Design and Normalization",
        "SQL Basics and Advanced Queries",
        "Data Integrity and Security",
        "NoSQL Databases",
        "Database Optimization",
        "Project: Building a Database Application",
        "Final Exam",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand database design and management",
        "Develop skills in SQL querying and optimization",
        "Gain experience with NoSQL databases",
        "Prepare for roles in database administration",
      ],
      instructor: "Mia Clark",
      rewardPoints: 70,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSKWg5XXymdS7LxisDQNF0jwbeqMFugOPrRg&s",
    },
    {
      name: "Cloud Computing Basics",
      introduction:
        "Explore the fundamentals of cloud computing in this course. You'll learn about cloud service models, deployment types, and major cloud providers like AWS, Azure, and Google Cloud. The curriculum includes practical exercises for deploying and managing cloud resources. You'll gain hands-on experience with cloud platforms and services, understanding how to use them for different applications. By the end of the course, you'll have a solid foundation in cloud computing and be ready for more advanced topics.",
      curriculum: [
        "Introduction to Cloud Computing",
        "Cloud Service Models (IaaS, PaaS, SaaS)",
        "Cloud Deployment Models",
        "Major Cloud Providers",
        "Deploying Cloud Resources",
        "Cloud Security and Compliance",
        "Cost Management and Optimization",
        "Final Project",
      ],
      duration: "6 weeks",
      benefits: [
        "Understand cloud computing concepts",
        "Gain experience with major cloud platforms",
        "Learn how to deploy and manage cloud resources",
        "Prepare for cloud computing certifications",
      ],
      instructor: "Ava Roberts",
      rewardPoints: 55,
      image:
        "https://ostechnix.com/wp-content/uploads/2021/12/Cloud-Computing.png.webp",
    },
    {
      name: "Cybersecurity Essentials",
      introduction:
        "Get a comprehensive overview of cybersecurity in this course. You'll learn about key concepts such as threat modeling, risk management, and common security practices. The curriculum covers topics like network security, encryption, and incident response. You'll work on projects to understand how to protect systems and data from various threats. By mastering cybersecurity essentials, you'll be prepared to handle security challenges and pursue further studies in the field.",
      curriculum: [
        "Introduction to Cybersecurity",
        "Threat Modeling and Risk Management",
        "Network Security",
        "Cryptography and Encryption",
        "Security Policies and Practices",
        "Incident Response",
        "Security Tools and Techniques",
        "Final Exam",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand key cybersecurity concepts",
        "Learn to protect systems and data",
        "Gain hands-on experience with security tools",
        "Prepare for cybersecurity roles and certifications",
      ],
      instructor: "Isabella Lee",
      rewardPoints: 80,
      image:
        "https://cdn.vectorstock.com/i/500p/97/67/cyber-security-logo-template-vector-20409767.jpg",
    },
    {
      name: "Machine Learning Fundamentals",
      introduction:
        "Discover the basics of machine learning in this course. You'll learn about different types of machine learning algorithms, including supervised and unsupervised learning. The curriculum covers data preprocessing, model training, and evaluation techniques. You'll work on projects that involve building and testing machine learning models using popular libraries. By the end of the course, you'll have a solid understanding of machine learning concepts and be prepared for more advanced topics in the field.",
      curriculum: [
        "Introduction to Machine Learning",
        "Supervised Learning Algorithms",
        "Unsupervised Learning Algorithms",
        "Model Training and Evaluation",
        "Data Preprocessing",
        "Machine Learning Libraries",
        "Hands-on Projects",
        "Final Project",
      ],
      duration: "10 weeks",
      benefits: [
        "Understand machine learning fundamentals",
        "Build and evaluate machine learning models",
        "Work with popular ML libraries",
        "Prepare for advanced machine learning courses",
      ],
      instructor: "Liam Walker",
      rewardPoints: 85,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoxhP_g0_7LahAj18VPEY9rwgAsv0UWi5DJNO0o6VTAvsE2q8rpZLamRrPzesrMH9aIYY&usqp=CAU",
    },
    {
      name: "Introduction to Algorithms and Data Structures",
      introduction:
        "This course introduces fundamental algorithms and data structures essential for computer science. You'll learn about sorting and searching algorithms, data structures like arrays, linked lists, and trees, and their applications. The curriculum includes problem-solving techniques and hands-on exercises to implement and optimize algorithms. By mastering these concepts, you'll improve your coding skills and be prepared for technical interviews and advanced studies in algorithms.",
      curriculum: [
        "Introduction to Algorithms",
        "Sorting Algorithms",
        "Searching Algorithms",
        "Data Structures (Arrays, Linked Lists, Trees)",
        "Algorithm Complexity Analysis",
        "Problem-Solving Techniques",
        "Hands-on Exercises",
        "Final Project",
      ],
      duration: "7 weeks",
      benefits: [
        "Understand core algorithms and data structures",
        "Improve problem-solving skills",
        "Enhance coding proficiency",
        "Prepare for technical interviews",
      ],
      instructor: "Noah Davis",
      rewardPoints: 60,
      image:
        "https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fdbjdw205hlkh80jucsx3.png",
    },
    {
      name: "Software Testing and Quality Assurance",
      introduction:
        "Explore the principles and practices of software testing and quality assurance in this course. You'll learn about different testing methodologies, including unit testing, integration testing, and system testing. The curriculum covers test case design, automation tools, and best practices for ensuring software quality. You'll work on projects to apply testing techniques and tools in real-world scenarios. By mastering software testing, you'll be able to ensure the reliability and performance of software applications.",
      curriculum: [
        "Introduction to Software Testing",
        "Testing Methodologies",
        "Test Case Design",
        "Automation Testing Tools",
        "Performance Testing",
        "Quality Assurance Best Practices",
        "Hands-on Projects",
        "Final Exam",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand software testing principles",
        "Learn to design and execute test cases",
        "Gain experience with testing tools",
        "Ensure software quality and reliability",
      ],
      instructor: "Grace Martinez",
      rewardPoints: 70,
      image:
        "https://6104926.fs1.hubspotusercontent-na1.net/hubfs/6104926/Imported_Blog_Media/software-762486_960_720_0.jpg",
    },
    {
      name: "Internet of Things (IoT) Fundamentals",
      introduction:
        "Get an overview of the Internet of Things (IoT) and its applications in this course. You'll learn about IoT architectures, communication protocols, and device management. The curriculum includes hands-on projects to build IoT systems and work with IoT platforms. You'll explore real-world IoT use cases and gain practical experience in deploying IoT solutions. By understanding IoT fundamentals, you'll be prepared to work on IoT projects and innovations.",
      curriculum: [
        "Introduction to IoT",
        "IoT Architectures",
        "Communication Protocols",
        "Device Management",
        "IoT Platforms and Tools",
        "Hands-on IoT Projects",
        "Real-world IoT Use Cases",
        "Final Project",
      ],
      duration: "9 weeks",
      benefits: [
        "Understand IoT concepts and architectures",
        "Build and deploy IoT systems",
        "Explore real-world IoT applications",
        "Prepare for IoT development roles",
      ],
      instructor: "Alexander Young",
      rewardPoints: 75,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFsADnNYLiaOicxtcQ5KqLf4oI945mW7CQg&s",
    },
    {
      name: "Blockchain Technology Basics",
      introduction:
        "This course provides a foundational understanding of blockchain technology. You'll learn about blockchain principles, cryptographic techniques, and decentralized applications (dApps). The curriculum covers blockchain architectures, consensus algorithms, and smart contracts. You'll work on projects to implement and deploy blockchain solutions. By mastering blockchain technology basics, you'll be prepared for further studies in blockchain development and applications.",
      curriculum: [
        "Introduction to Blockchain Technology",
        "Blockchain Principles and Architecture",
        "Cryptographic Techniques",
        "Consensus Algorithms",
        "Smart Contracts",
        "Decentralized Applications (dApps)",
        "Hands-on Blockchain Projects",
        "Final Project",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand blockchain technology fundamentals",
        "Develop and deploy blockchain solutions",
        "Explore cryptographic techniques and smart contracts",
        "Prepare for blockchain development roles",
      ],
      instructor: "Charlotte Lewis",
      rewardPoints: 85,
      image:
        "https://www.truscholar.io/wp-content/uploads/2021/08/Blockchain-basics-guide.jpg",
    },
    {
      name: "Network Security Essentials",
      introduction:
        "Gain a comprehensive understanding of network security in this course. You'll cover fundamental concepts such as network protocols, security threats, and protection mechanisms. The curriculum includes topics like firewalls, intrusion detection systems, and encryption techniques. You'll work on projects to apply network security principles and protect networked systems. By mastering network security essentials, you'll be equipped to handle security challenges and pursue further studies in network security.",
      curriculum: [
        "Introduction to Network Security",
        "Network Protocols and Security Threats",
        "Firewalls and Intrusion Detection Systems",
        "Encryption Techniques",
        "Network Security Policies",
        "Hands-on Projects",
        "Incident Response",
        "Final Exam",
      ],
      duration: "7 weeks",
      benefits: [
        "Understand network security concepts",
        "Protect networked systems from threats",
        "Gain experience with security tools",
        "Prepare for network security roles",
      ],
      instructor: "Mason Allen",
      rewardPoints: 70,
      image:
        "https://images-platform.99static.com//sugYZp6akhG-0qQ-6eHKqCr-sVg=/0x0:1111x1111/fit-in/500x500/99designs-contests-attachments/87/87712/attachment_87712455",
    },
    {
      name: "DevOps Fundamentals",
      introduction:
        "Learn about DevOps principles and practices in this course. You'll explore continuous integration, continuous delivery, and infrastructure as code. The curriculum covers tools and techniques used in DevOps, such as version control systems, CI/CD pipelines, and containerization. You'll work on projects to automate development and deployment processes. By mastering DevOps fundamentals, you'll be able to streamline software development workflows and improve collaboration between development and operations teams.",
      curriculum: [
        "Introduction to DevOps",
        "Continuous Integration and Continuous Delivery",
        "Infrastructure as Code",
        "Version Control Systems",
        "CI/CD Pipelines",
        "Containerization with Docker",
        "Automation Tools",
        "Final Project",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand DevOps principles and practices",
        "Automate development and deployment processes",
        "Work with DevOps tools and techniques",
        "Improve collaboration between development and operations",
      ],
      instructor: "Zoe King",
      rewardPoints: 75,
      image:
        "https://images.spiceworks.com/wp-content/uploads/2022/04/21082621/two-gears-with-dev-and-ops-title-in-paper-depicting-azure-devops.jpg",
    },
    {
      name: "Introduction to Computational Thinking",
      introduction:
        "Explore computational thinking concepts in this course, focusing on problem-solving and algorithmic thinking. You'll learn about different problem-solving techniques, such as decomposition, pattern recognition, and abstraction. The curriculum includes exercises to apply these techniques to real-world problems. You'll also work on projects that involve creating algorithms and solving complex problems. By mastering computational thinking, you'll develop skills essential for computer science and programming.",
      curriculum: [
        "Introduction to Computational Thinking",
        "Problem-Solving Techniques",
        "Algorithm Design",
        "Abstraction and Pattern Recognition",
        "Hands-on Exercises",
        "Real-world Problem Solving",
        "Project: Creating Algorithms",
        "Final Exam",
      ],
      duration: "6 weeks",
      benefits: [
        "Develop problem-solving and algorithmic thinking skills",
        "Apply computational thinking techniques to real-world problems",
        "Enhance programming and computer science skills",
        "Prepare for advanced studies in computer science",
      ],
      instructor: "Evelyn Green",
      rewardPoints: 60,
      image:
        "https://png.pngtree.com/png-vector/20221231/ourmid/pngtree-computational-thinking-icon-in-blue-gradient-with-focus-vector-png-image_43740786.jpg",
    },
    {
      name: "Introduction to Data Engineering",
      introduction:
        "Learn the fundamentals of data engineering in this course. You'll cover data pipelines, data warehousing, and ETL (Extract, Transform, Load) processes. The curriculum includes hands-on projects to design and implement data pipelines using popular tools and technologies. You'll also learn about data storage solutions and data integration techniques. By mastering data engineering, you'll be able to build and manage data systems effectively for various applications.",
      curriculum: [
        "Introduction to Data Engineering",
        "Data Pipelines and Workflows",
        "Data Warehousing Concepts",
        "ETL Processes",
        "Data Storage Solutions",
        "Data Integration Techniques",
        "Hands-on Projects",
        "Final Exam",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand data engineering concepts",
        "Design and implement data pipelines",
        "Work with data warehousing and ETL processes",
        "Prepare for data engineering roles",
      ],
      instructor: "Lucas Adams",
      rewardPoints: 70,
      image:
        "https://assets.datacamp.com/production/course_19930/shields/original/shield_image_course_19930_20220901-1-mdqgs9?1662027170",
    },
    {
      name: "Introduction to Cloud Development",
      introduction:
        "Get introduced to cloud development concepts and practices in this course. You'll learn about cloud platforms, services, and development tools. The curriculum covers topics like cloud architecture, serverless computing, and cloud-based databases. You'll work on projects to deploy and manage cloud applications. By mastering cloud development, you'll be able to build scalable and reliable cloud-based solutions for various use cases.",
      curriculum: [
        "Introduction to Cloud Development",
        "Cloud Platforms and Services",
        "Cloud Architecture",
        "Serverless Computing",
        "Cloud-based Databases",
        "Deployment and Management",
        "Hands-on Projects",
        "Final Exam",
      ],
      duration: "7 weeks",
      benefits: [
        "Understand cloud development concepts",
        "Deploy and manage cloud applications",
        "Work with cloud platforms and services",
        "Prepare for cloud development roles",
      ],
      instructor: "Harper Johnson",
      rewardPoints: 65,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRibeGOjpS_nsCFynUx7ww_FFAHJdLUl5MD-eq700PissD_ZXCr59N8YaKhZrHgk00zW68&usqp=CAU",
    },
    {
      name: "Introduction to Cyber-Physical Systems",
      introduction:
        "This course explores cyber-physical systems (CPS) and their applications. You'll learn about the integration of computing, networking, and physical processes. The curriculum includes topics like sensors, actuators, and control systems. You'll work on projects to design and implement CPS solutions. By understanding cyber-physical systems, you'll be prepared to work on applications that involve the interaction between physical and digital components.",
      curriculum: [
        "Introduction to Cyber-Physical Systems",
        "Sensors and Actuators",
        "Control Systems",
        "Networking and Communication",
        "CPS Architectures",
        "Hands-on Projects",
        "Real-world Applications",
        "Final Exam",
      ],
      duration: "9 weeks",
      benefits: [
        "Understand cyber-physical systems concepts",
        "Design and implement CPS solutions",
        "Explore real-world applications of CPS",
        "Prepare for roles in CPS development",
      ],
      instructor: "Jack Wilson",
      rewardPoints: 80,
      image: "https://cdn-icons-png.flaticon.com/512/9709/9709198.png",
    },
    {
      name: "Introduction to Quantum Computing",
      introduction:
        "Get introduced to quantum computing and its principles in this course. You'll learn about quantum bits (qubits), quantum gates, and quantum algorithms. The curriculum includes topics like quantum entanglement and quantum superposition. You'll work on projects to understand and apply quantum computing concepts. By mastering quantum computing basics, you'll be prepared for advanced studies and research in this emerging field.",
      curriculum: [
        "Introduction to Quantum Computing",
        "Quantum Bits and Gates",
        "Quantum Algorithms",
        "Quantum Entanglement",
        "Quantum Superposition",
        "Hands-on Projects",
        "Applications of Quantum Computing",
        "Final Exam",
      ],
      duration: "8 weeks",
      benefits: [
        "Understand quantum computing principles",
        "Apply quantum computing concepts",
        "Explore real-world applications of quantum computing",
        "Prepare for advanced studies in quantum computing",
      ],
      instructor: "Ella Martinez",
      rewardPoints: 90,
      image: "https://cdn-icons-png.flaticon.com/512/1998/1998708.png",
    },
  ];

  const course = {
    id,
    name: dataa[id].name,
    description: dataa[id].introduction,
    curriculum: dataa[id].curriculum,
    duration: dataa[id].duration,
    benefits: dataa[id].benefits,
    author: dataa[id].instructor,
    rewardPoints: dataa[id].rewardPoints,
    image: dataa[id].image,
  };

  const handleStart = () => {
    setCourseStarted(true);
  };

  const handleComplete = async () => {
    const recipient = JSON.parse(localStorage.getItem("userData"))[
      "walletAddress"
    ];
    const amount = course.rewardPoints * 0.01;
    console.log(web3.utils.toWei(amount, "ether"));

    if (contract && web3) {
      try {
        console.log("Recipient Address:", recipient); // Log recipient to ensure it's correct
        console.log("Sender Address:", account); // Log sender to ensure it's correct
        console.log("Amount (ETH):", amount); // Log amount to ensure it's correct

        await contract.methods.transfer(recipient).send({
          from: account,
          value: web3.utils.toWei(amount, "ether"),
        });
        alert("Transfer successful!");
        setRewardAdded(true); // Mark reward as added
      } catch (error) {
        console.error("Transfer failed", error);
      }
    }
  };

  const handleDownloadCertificate = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const backgroundImage =
      "https://cdn.pixabay.com/photo/2016/03/07/23/19/certificate-1243231_1280.png";
    doc.addImage(backgroundImage, "PNG", 0, 0, 210, 297); // A4 size in mm

    doc.setFontSize(40);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51);
    doc.text("Certificate", 105, 50, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51);
    doc.text("of", 105, 65, { align: "center" });

    doc.setFontSize(27);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51);
    doc.text("Achievement", 105, 80, { align: "center" });

    doc.setFontSize(23);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 102);
    doc.text("This is to certify that", 105, 130, { align: "center" });

    doc.setFontSize(25);
    doc.setFont("Cursive", "bolditalic");
    doc.setTextColor(0, 0, 102);
    doc.text(`${userData.name || "N/A"}`, 105, 140, { align: "center" });

    doc.setFontSize(23);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 102);
    doc.text("has successfully completed the course", 105, 150, {
      align: "center",
    });
    doc.text(`${course.name}`, 105, 160, { align: "center" });
    doc.text(`with ${course.rewardPoints} reward points.`, 105, 170, {
      align: "center",
    });

    doc.setFontSize(17);
    doc.setFont("Cursive", "italic");
    doc.setTextColor(0, 0, 102);
    doc.text("Awarded by EduChain", 105, 200, { align: "center" });

    doc.save("certificate.pdf");
    setCertificateGenerated(true);
  };

  return (
    <div className="course-detail-container">
      <nav className="course-nav">
        <h1>{course.name}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        {/*Back Button */}
      </nav>
      <div className="course-content">
        <div className="course-image-card">
          <img src={course.image} alt={course.name} />
          <p>{course.description}</p>
        </div>
        <div className="course-details-card">
          <div className="course-detail-section">
            <h3>Curriculum</h3>
            <p>{course.curriculum}</p>
          </div>
          <div className="course-detail-section">
            <h3>Duration</h3>
            <p>{course.duration}</p>
          </div>
          <div className="course-detail-section">
            <h3>Benefits</h3>
            <p>{course.benefits}</p>
          </div>
          <div className="course-detail-section">
            <h3>Instructor</h3>
            <p>{course.author}</p>
          </div>
          <div className="course-detail-section">
            <h3>Reward Points</h3>
            <p>{course.rewardPoints}</p>
          </div>
          <div className="course-actions">
            <button
              onClick={handleStart}
              style={{ backgroundColor: courseStarted ? "green" : "" }}
            >
              {courseStarted ? "Course Started" : "Enroll"}
            </button>
            <button onClick={handleComplete} disabled={rewardAdded}>
              {rewardAdded ? "Reward Added" : "Complete"}
            </button>
            {rewardAdded && !certificateGenerated && (
              <button onClick={handleDownloadCertificate}>
                Get Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
