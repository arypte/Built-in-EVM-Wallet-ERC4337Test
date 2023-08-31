import Main from './pages/main';
import TestPage from './pages/testpage';

const { BrowserRouter, Route, Routes } = require('react-router-dom');

function App() {
  return (
    <BrowserRouter>
      <div className="iphone-container min-h-[844px]">
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="*" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
