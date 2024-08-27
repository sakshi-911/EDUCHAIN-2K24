import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CourseEnrollment from './artifacts/contracts/CourseEnrollment.sol/CourseEnrollment.json'; // Path to ABI

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function init() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
      const contract = new ethers.Contract(contractAddress, CourseEnrollment.abi, provider.getSigner());
      setContract(contract);

      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    }

    init();
  }, []);

  return (
    <div className="App">
      <h1>Course Enrollment</h1>
      <p>Connected Account: {account}</p>
      {/* Add more UI components to interact with the contract */}
    </div>
  );
}

export default App;
