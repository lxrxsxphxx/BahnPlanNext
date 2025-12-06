export default function LoginForm() {
    
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
                        placeholder="Benutzername eingeben"
                    />
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Passwort
                    </label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Passwort eingeben"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
                >
                    Anmelden
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Noch kein Konto? <button type="button" className="text-blue-600 hover:underline font-medium">Registrieren</button>
                </div>
            </form>
        </div>
    );
}