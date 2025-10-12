<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StudentProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get student profile
     */
    public function show(Request $request)
    {
        $student = Auth::user();

        return response()->json([
            'student' => [
                'id' => $student->id,
                'user_id' => $student->id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'phone' => $student->phone,
                'birth_date' => $student->birth_date,
                'address' => $student->address,
                'emergency_contact' => $student->emergency_contact,
                'emergency_phone' => $student->emergency_phone,
                'medical_info' => $student->medical_info,
                'profile_picture' => $student->profile_picture,
                'preferences' => $student->preferences ?? ['theme' => 'light', 'notifications' => true],
                'classe' => $student->classe,
                'user' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                ]
            ]
        ]);
    }

    /**
     * Update student profile
     */
    public function update(Request $request)
    {
        $student = Auth::user();

        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'medical_info' => 'nullable|string|max:1000',
            'preferences.theme' => 'nullable|in:light,dark,auto',
            'preferences.notifications' => 'nullable|boolean',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'student' => $student
        ]);
    }

    /**
     * Change student password
     */
    public function changePassword(Request $request)
    {
        $student = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $student->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        // Changer le mot de passe
        $student->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Mot de passe changé avec succès'
        ]);
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        $student = Auth::user();

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $student->id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile_pictures', $filename, 'public');

            // Supprimer l'ancienne photo si elle existe
            if ($student->profile_picture) {
                Storage::disk('public')->delete($student->profile_picture);
            }

            $student->update(['profile_picture' => $path]);

            return response()->json([
                'message' => 'Photo de profil mise à jour avec succès',
                'profile_picture_url' => asset('storage/' . $path)
            ]);
        }

        return response()->json(['message' => 'Aucun fichier reçu'], 400);
    }

    /**
     * Delete profile picture
     */
    public function deleteProfilePicture(Request $request)
    {
        $student = Auth::user();

        if ($student->profile_picture) {
            Storage::disk('public')->delete($student->profile_picture);
            $student->update(['profile_picture' => null]);

            return response()->json([
                'message' => 'Photo de profil supprimée avec succès'
            ]);
        }

        return response()->json(['message' => 'Aucune photo de profil à supprimer'], 404);
    }
}