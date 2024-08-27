import React from "react";
import { jsPDF } from "jspdf";
import "./Certificate.css";

const Certificate = () => {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const course = {
    name: "Course Name",
    rewardPoints: "Reward Points",
  };

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add background image
    const backgroundImage =
      "https://cdn.pixabay.com/photo/2016/03/07/23/19/certificate-1243231_1280.png";
    doc.addImage(backgroundImage, "PNG", 0, 0, 210, 297); // A4 size in mm

    // Set title
    doc.setFontSize(36);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51); // Golden text color
    doc.text("Certificate", 105, 50, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51); // Golden text color
    doc.text("of", 105, 55, { align: "center" });

    doc.setFontSize(27);
    doc.setFont("Cursive", "bold");
    doc.setTextColor(0, 0, 51); // Golden text color
    doc.text("Achievement", 105, 60, { align: "center" });
    // Add user details
    /*  doc.setFontSize(24);
   doc.setFont("helvetica", "bold");
   doc.setTextColor(255, 255, 255); // White text color for details
   doc.text(`Name: ${userData.name || "N/A"}`, 105, 90, { align: "center" }); */

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
    doc.text(`${course.name}`, 105, 190, { align: "center" });
    doc.text(`with ${course.rewardPoints} reward points.`, 105, 160, {
      align: "center",
    });

    // Add decorative elements
    doc.setFontSize(14);
    doc.setFont("Cursive", "italic");
    doc.setTextColor(0, 0, 102); // White text color for the footer
    doc.text("Awarded by EduChain", 105, 200, { align: "center" });

    // Save the document
    doc.save("certificate.pdf");
  };

  return (
    <div className="certificate-container">
      <h1>Certificate of Completion</h1>
      <button onClick={generateCertificate}>Download Certificate</button>
    </div>
  );
};

export default Certificate;
