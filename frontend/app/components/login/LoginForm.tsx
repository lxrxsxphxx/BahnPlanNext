import { useState } from 'react';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(username === '' || password === '') {
            setError('Bitte füllen Sie alle Felder aus.');
        } else {
            setError(null);
            // Hier würde die Anmelde-Logik implementiert werden
        }
    };

    return (
        <div className="text-gray-900">
            <h2 className="text-2xl font-semibold mb-6 text-center">Anmelden</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Benutzername
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Benutzername/Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Passwort
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 my-auto text-sm font-medium text-blue-600 hover:text-blue-700"
                            aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                        >
                            {showPassword ? 'Verbergen' : 'Anzeigen'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
                    onClick={handleSubmit}
                >
                    Anmelden
                </button>
                <p className='text-red-600 text-center mt-2'>{error}</p>
            </form>
        </div>
    );
}