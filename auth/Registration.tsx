import React, { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { registration } from "./authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Auth.module.scss";
import welcome from './styles/welcome_bg.svg';
import NavForAuth from "../navigation/NavForAuth";

export default function Registration(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onHandleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(registration({ name, email, password, cpassword }))
    .then((data) => {
      if ("error" in data) {
        setError(data.error.message); // Показываем ошибку, если авторизация не удалась
        return; // Прерываем выполнение функции, чтобы не перенаправлять пользователя
      }
        interface User{
          id: number | undefined,
          name: string,
        }
        const user: User = {id: data.payload.id, name: data.payload.name}
        localStorage.setItem('user', JSON.stringify(user)); // Сохраняем userId в localStorage       
        navigate("/"); // Переадресация на главную страницу
    })
    .catch((error) => {
      console.log(error);
      setError("Произошла ошибка при авторизации"); // Установка сообщения об ошибке при возникновении исключения
    });
  };

  return (
    <>
      <NavForAuth />
      <div className={styles.container}>
        <form id="reg-form" onSubmit={onHandleSubmit}>
          <h2>Вперед к коммьюнити</h2>
          <img src={welcome} alt="welcome" />
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="login"
              type="text"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              placeholder="Введите e-mail"
            />
          </div>
          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              placeholder="Ваш пароль"
            />
          </div>
          <div>
            <input
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              name="cpassword"
              type="password"
              placeholder="Повторите пароль"
            />
          </div>
          {error && (
            <div className="fail" style={{ color: "red" }}>
              {error}
            </div>
          )}
          <p onClick={() => navigate("/auth/authorization")}>У вас уже есть аккаунт? Вход</p>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </>
  );
}
