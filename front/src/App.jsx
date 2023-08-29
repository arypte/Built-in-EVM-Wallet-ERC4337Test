import { useState } from 'react';

function App() {
  const [address, setAddress] = useState();

  return (
    <div className="min-h-screen bg-red-100 w-[640px] mx-auto flex justify-center items-center">
      <button className="bg-blue-100 border-2 rounded-sm border-blue-200 p-2">
        Login
      </button>
      {address && <div className="bg-blue-100">{address}</div>}
    </div>
  );
}

export default App;
