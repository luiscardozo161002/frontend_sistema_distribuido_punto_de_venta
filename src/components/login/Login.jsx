import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/header');
    }
  };

  return (
    <div className='container d-flex flex-column align-items-center justify-content-center mt-5'>
      <form className='card p-3 mb-3' onSubmit={handleSubmit}>
        <img src="https://i.ibb.co/9vybH9Y/logo-ferreteria.png" alt="Imagen de Ferrexpress" style={{width:"250px"}} />
        <h2 className='text-center mb-3'>Inicio de Sesión</h2>
        <div className='d-flex flex-column mb-2'>
          <label htmlFor="username" className='mb-2'>Usuario</label>
          <div className='input-group'>
            <span className='input-group-text'><i className="bi bi-person-circle"></i></span>
              <input
            type="text"
            id="username"
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Ingresa el usuario'
          />
          </div>
          
        </div>
        <div className='d-flex flex-column mb-3'>
          <label htmlFor="password" className='mb-2'>Contraseña</label>
          <div className='input-group'>
          <span className='input-group-text'><i className="bi bi-unlock"></i></span>
          <input
            type="password"
            id="password"
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Ingresa la contraseña'
          />
          </div>
        </div>
        <button type="submit" disabled={loading} className='btn btn-success mb-2'>Acceder</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
