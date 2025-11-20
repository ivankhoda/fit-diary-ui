/* eslint-disable sort-keys */
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('jwt-decode', () => jest.fn());

describe('Login Component', () => {
    const setTokenMock = jest.fn();
    const isAdminMock = jest.fn();
    const navigateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);

        // Мок fetch
        global.fetch = jest.fn();
    });

    it('renders login form by default', () => {
        render(<Login setToken={setTokenMock} isAdmin={isAdminMock} />);
        expect(screen.getByText('login_first')).toBeInTheDocument();
        expect(screen.getByLabelText('login')).toBeInTheDocument();
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        expect(screen.getByText('forgot_password')).toBeInTheDocument();
    });

    it('switches to password recovery mode', () => {
        render(<Login setToken={setTokenMock} isAdmin={isAdminMock} />);
        fireEvent.click(screen.getByText('forgot_password'));
        expect(screen.getByText('password_recovery')).toBeInTheDocument();
        expect(screen.getByText('send_recovery_email')).toBeInTheDocument();
    });

    it('calls setToken and navigates after successful login', async() => {
        const fakeToken = 'fake.jwt.token';
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => ({ jwt: fakeToken }),
        });
        (jwtDecode as unknown as jest.Mock).mockReturnValue({ admin: true });

        render(<Login setToken={setTokenMock} isAdmin={isAdminMock} />);

        fireEvent.change(screen.getByLabelText('login'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('button_ok'));

        await waitFor(() => expect(setTokenMock).toHaveBeenCalledWith(fakeToken));
        expect(navigateMock).toHaveBeenCalledWith('/admin');
    });

    it('shows error message on failed login', async() => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: () => ({ errors: 'Invalid credentials' }),
        });

        render(<Login setToken={setTokenMock} isAdmin={isAdminMock} />);
        fireEvent.change(screen.getByLabelText('login'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText('password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText('button_ok'));

        await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
        expect(setTokenMock).not.toHaveBeenCalled();
    });

    it('sends recovery email successfully', async() => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => ({}),
        });

        render(<Login setToken={setTokenMock} isAdmin={isAdminMock} />);
        fireEvent.click(screen.getByText('forgot_password'));
        fireEvent.change(screen.getByLabelText('enter_email'), { target: { value: 'user@example.com' } });
        fireEvent.click(screen.getByText('send_recovery_email'));

        await waitFor(() => expect(screen.getByText('password_reset_link_sent')).toBeInTheDocument());
    });
});
