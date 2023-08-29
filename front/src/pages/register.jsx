import React, { useState, useEffect } from 'react';

const Register = () => {
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [editingNickname, setEditingNickname] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('address');
    const savedNickname = localStorage.getItem('nickname');

    if (savedAddress) {
      setAddress(savedAddress);
    } else {
      const defaultAddress = 'your_default_address';
      setAddress(defaultAddress);
      localStorage.setItem('address', defaultAddress);
    }

    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleNicknameSave = () => {
    localStorage.setItem('nickname', nickname);
    setEditingNickname(false);
  };

  return (
    <div className="min-h-screen bg-red-100 w-[640px] mx-auto flex justify-center items-center">
      {editingNickname ? (
        <div>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            className="bg-blue-100 border-2 rounded-sm border-blue-200 p-2"
          />
          <button
            onClick={handleNicknameSave}
            className="bg-green-100 border-2 rounded-sm border-green-200 p-2 ml-2"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditingNickname(true)}
          className="bg-blue-100 border-2 rounded-sm border-blue-200 p-2"
        >
          Edit Nickname
        </button>
      )}
      {address && <div className="bg-blue-100">{address}</div>}
      {nickname && <div className="bg-blue-100 mt-2">Nickname: {nickname}</div>}
    </div>
  );
};

export default Register;
