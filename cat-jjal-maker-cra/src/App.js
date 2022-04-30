import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

// 중괄호를 쓰면 js 문법을 react 문법안에서 쓸 수 있다. 
console.log("야옹");
// className, Inline 방식의 스타일링
function CatItem({ img }) {
  return (
    <li>
      <img src={img} style={{ width: "150px" }} />
    </li>
  );
};

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진의 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }

  // 리스트 형식으로 Map을 사용할 때 각 개체를 구분할 수 있는 키값을 key로 설정해야한다. 
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
};

const MainCard = ({ img, onHeartClick, alreadyFavorites }) => {
  const heartIcon = alreadyFavorites ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button
        onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ updateMainCat }) => {
  const [inputVal, setInputVal] = React.useState('');
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }

    setInputVal(e.target.value.toUpperCase());
  };

  function handleFormSubmit2(e) {
    e.preventDefault();

    if (inputVal === "") {
      setErrorMessage("빈 값으로는 생성할 수 없습니다.");
      return false;
    }
    updateMainCat(inputVal);
  }

  return (
    <form onSubmit={handleFormSubmit2}>
      <input
        value={inputVal}
        onChange={handleInputChange}
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
      />
      <button type="submit">생성</button>

      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  // 상태를 만들자
  // const counterState = React.useState(1);

  // useState의 2번째 인자를 통해 상태값을 변경할 수 있다.
  // useState의 1번째 인자는 현재값.

  // const counter = counterState[0];
  // const setCounter = counterState[1];
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  // 상태값을 한번에 만들 수 있음.
  // React.useState("test" || "1") test값이 없으면 1을 써라.
  // const [counter, setCounter] = React.useState(jsonLocalStorage.getItem("counter") || 1);
  // const [favorites, setFavorites] = React.useState(jsonLocalStorage.getItem("favorites") || []);

  // useState를 사용할 때 값 대신 함수를 넘기게 하면 localStorage를 한번만 접근하게 한다.
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter") || 1;
  });
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });


  const [catImg, changeCatImg] = React.useState(CAT1);

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    changeCatImg(newCat);
  }

  // useEffect를 사용하여, 화면의 데이터가 변경될 때의 이벤트를 다룰 수 있다.
  // useEffect를 쓸 때 2번째 인자를 사용하여 컨트롤 하는데 빈 배열 []인 경우 최초 App 구동 시 한번만 실행된다.
  // 빈 배열이 아닌 counter처럼 useState를 통해 만들어진 변수를 사용한다면 해당 변수의 데이터가 변경될 떄 실행된다.
  React.useEffect(() => {
    setInitialCat();
  }, []);

  // 상태 끌어올리기
  async function updateMainCat(formInputVal) {
    const newCat = await fetchCat(formInputVal);
    changeCatImg(newCat);
    // event.preventDefault()를 사용하면 submit 시 창이 재시작 되지 않음.
    // event.preventDefault();

    // const nextCounter = counter + 1;
    // setCounter(nextCounter);

    // setState에 인자에 값 대신 함수를 넘기게 되면, 데이터가 정확하게 바뀐다.
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return prev + 1;
    });
  };

  function handleHeartClick() {
    const nextFavorites = [...favorites, catImg];
    // ...변수1 , 변수2 -> 변수 1 리스트 뒤에 변수2 추가 
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  };

  const alreadyFavorites = favorites.includes(catImg);

  return (
    <div>
      <Title counter={counter} title="고양이 가라사대"></Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={catImg} onHeartClick={handleHeartClick} alreadyFavorites={alreadyFavorites} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
