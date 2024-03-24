import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { abi } from '../abis/abi';

function MyComponent({ data, isLoading, isError, error }) {
  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return <div>{data}</div>;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const { data: contractData, isLoading: isLoadingContract, isError: isErrorContract, error: errorContract } = useReadContract({
    abi,
    address: process.env.CONTRACT_DEPLOYMENT_ADDRESS,
    functionName: 'buyer',
  });

  useEffect(() => {
    if (isLoadingContract) {
      setIsLoading(true);
      console.log(isLoadingContract)
    } else if (isErrorContract) {
      setIsError(true);
      setError(errorContract);
    } else {
      setData(contractData);
      setIsLoading(false);
      console.log(contractData)
    }
  }, [isLoadingContract, isErrorContract, contractData, errorContract]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <MyComponent data={data} isError={isError} error={error} />;
}