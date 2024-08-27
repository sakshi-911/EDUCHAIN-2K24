import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import styles from "./index.module.css";
import CourseDetail from "./CourseDetail";
import Certificate from "./Certificate";
import Page2 from "./Page2";
import loggo from "./1000124300-removebg-preview.png";

const HomePage = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name && contact && email && walletAddress) {
      localStorage.setItem(
        "userData",
        JSON.stringify({ name, contact, email, walletAddress })
      );
      navigate("/Page2");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className={styles.main}>
      {/* Logo Section */}
      <div className={styles.logoWrapper}>
        <img src={loggo} alt="Logo" />
        <div className={styles.logoText}>BLIP</div>
        <div className={styles.logoDescription}>
          Course enrollment and Certification System Web App
        </div>
      </div>
      <div className={styles.homeContainer}>
        <div className={styles.formWrapper}>
          <h1>Sign Up</h1>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contact No</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <div className={styles.formGroup}>
            <label>MetaMask Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your MetaMask Wallet Address"
            />
          </div>
          <button onClick={handleSubmit}>Proceed</button>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Page2" element={<Page2 />} />
      <Route path="/CourseDetail/:id" element={<CourseDetail />} />
      <Route path="/Certificate" element={<Certificate />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
