import React from 'react';
import { useReadContract } from 'wagmi'
import { abi } from '../abis/abi'

function MyComponent() {
  const { data, isLoading, isError,error } = useReadContract({
    abi,
    address: '0xBe702231908AB2dbFc156e18Bab6c57285883694',
    functionName: 'number',
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data : {error.message}</div>;
  }

  return <div>{data.toString()}</div>;
}

export default MyComponent;
