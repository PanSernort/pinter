/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { authorization } from "./authSlice";
import styles from "./styles/Auth.module.scss";
import welcome from './styles/welcome_bg.svg';
import NavForLogin from "../navigation/NavForLogin";


export default function Authorization(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const onHandleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(authorization({ email, password }))
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
      <NavForLogin />
      <div className={styles.container}>
      <form id="reg-form" onSubmit={onHandleSubmit}>
        <h2>Без вас никуда! Мы ждали</h2>
        <img src={welcome} alt="welcome" />
        <div className="mb-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Введите e-mail"
          />
        </div>
        <div className="mb-3">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            className="form-control"
            placeholder="Введите пароль"
          />
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <button type="submit">Войти</button>
      </form>
    </div>
    </>
  );
}
