import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isRegistering) {
                // Registro de nuevo usuario
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                
                // Actualizar el perfil con el nombre
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });

                onLogin(userCredential.user);
            } else {
                // Login de usuario existente
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                onLogin(userCredential.user);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <h2>{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-100"
                                required={isRegistering}
                            />
                        </div>
                    )}
                    
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <Password
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            toggleMask
                            className="w-100"
                            required
                            feedback={isRegistering}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <Button
                        type="submit"
                        label={isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                        icon="pi pi-user"
                        loading={loading}
                        className="w-100 mb-3"
                    />

                    <Button
                        type="button"
                        label={isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                        className="p-button-text w-100"
                        onClick={() => setIsRegistering(!isRegistering)}
                    />
                </form>
            </Card>
        </div>
    );
};

export default Login; 