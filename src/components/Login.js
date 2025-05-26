import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
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
                try {
                    // Verificar si el username ya existe
                    const usernameDoc = await getDoc(doc(db, 'usernames', formData.username));
                    
                    if (usernameDoc.exists()) {
                        throw new Error('El nombre de usuario ya está en uso');
                    }
                } catch (error) {
                    // Si el error es porque la colección no existe, la crearemos con el primer usuario
                    if (!error.message.includes('El nombre de usuario ya está en uso')) {
                        // Continuamos con el registro
                        console.log('Primera creación de usuario');
                    } else {
                        throw error;
                    }
                }

                // Crear email único basado en el username
                const email = `${formData.username}@notes-app.com`;
                
                // Registro de nuevo usuario
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    formData.password
                );
                
                // Guardar el username en Firestore
                await setDoc(doc(db, 'usernames', formData.username), {
                    uid: userCredential.user.uid,
                    createdAt: new Date().toISOString()
                });

                // Actualizar el perfil con el nombre y username
                await updateProfile(userCredential.user, {
                    displayName: formData.name || formData.username
                });

                onLogin(userCredential.user);
            } else {
                // Login - convertir username a email
                const email = `${formData.username}@notes-app.com`;
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    formData.password
                );
                onLogin(userCredential.user);
            }
        } catch (error) {
            console.error('Error completo:', error);
            let errorMessage = 'Error en la autenticación';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'El nombre de usuario ya está en uso';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'Usuario no encontrado';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Contraseña incorrecta';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else if (error.message.includes('offline')) {
                errorMessage = 'Error de conexión con la base de datos. Verifica tu conexión a internet.';
            } else {
                errorMessage = error.message;
            }
            setError(errorMessage);
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
                            <label htmlFor="name">Nombre completo</label>
                            <InputText
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-100"
                                placeholder="Tu nombre completo"
                            />
                        </div>
                    )}
                    
                    <div className="field">
                        <label htmlFor="username">Nombre de usuario</label>
                        <InputText
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-100"
                            required
                            placeholder="Elige un nombre de usuario"
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
                            placeholder="Tu contraseña"
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