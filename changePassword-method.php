    /**
     * Changer le mot de passe
     * POST /api/student/change-password
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        // Vérifier le mot de passe actuel
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect',
                'errors' => [
                    'current_password' => ['Le mot de passe actuel est incorrect']
                ]
            ], 422);
        }

        // Vérifier que le nouveau mot de passe est différent
        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Le nouveau mot de passe doit être différent de l\'actuel',
                'errors' => [
                    'password' => ['Le nouveau mot de passe doit être différent de l\'actuel']
                ]
            ], 422);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Mot de passe changé avec succès'
        ]);
    }