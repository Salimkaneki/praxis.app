"use client";
import React, { useState, useEffect } from "react";
import StudentPageHeader from "../_components/page-header";
import Input from "../../../../components/ui/Inputs/Input";
import SelectInput from "../../../../components/ui/Inputs/Select";
import Textarea from "../../../../components/ui/Inputs/Textarea";
import Button from "../../../../components/ui/Buttons/Button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Bell,
  Palette,
  Camera,
  Save,
  X,
  LogOut,
  Loader2
} from "lucide-react";
import { getStudentProfile, logoutStudent, StudentProfile } from "../../auth/sign-in/student/_services/auth.service";

export default function StudentProfilePage() {
  // État du profil
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État du formulaire (pour les futures modifications)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    class: "",
    specialty: "",
    year: "",
    bio: "",
    notifications: "all",
    theme: "light"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loggingOut, setLoggingOut] = useState(false);

  // Charger le profil au montage du composant
  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getStudentProfile();
      setProfile(profileData);

      // Initialiser le formulaire avec les données du profil
      setFormData(prev => ({
        ...prev,
        email: profileData.email,
        // Les autres champs peuvent être vides pour l'instant car ils ne sont pas dans l'API
      }));
    } catch (err: any) {
      console.error('Erreur lors du chargement du profil:', err);
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutStudent();
      // La redirection est gérée dans la fonction logoutStudent
    } catch (err: any) {
      console.error('Erreur lors de la déconnexion:', err);
      // Même en cas d'erreur, la fonction logoutStudent fait la redirection
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Mon Profil"
          subtitle="Chargement de vos informations..."
        />
        <div className="w-full px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
              <p className="text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <StudentPageHeader
          title="Erreur de chargement"
          subtitle="Impossible de charger votre profil"
        />
        <div className="w-full px-8 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error || 'Profil non disponible'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={loadStudentProfile} className="w-auto">
                Réessayer
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-auto flex items-center gap-2"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Gestionnaire de changement
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Ici on pourrait faire un appel API
      console.log("Sauvegarde du profil:", formData);
      setIsEditing(false);
      // Afficher un message de succès
    }
  };

  // Annulation des modifications
  const handleCancel = () => {
    // Recharger les données originales (simulation)
    setFormData({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@ecole.fr",
      phone: "+33 6 12 34 56 78",
      birthDate: "2005-05-15",
      address: "123 Rue des Étudiants, 75001 Paris",
      class: "Terminale S",
      specialty: "Sciences",
      year: "2025",
      bio: "Étudiant passionné par les sciences et la programmation. J'aime résoudre des problèmes complexes et travailler en équipe.",
      notifications: "all",
      theme: "light"
    });
    setErrors({});
    setIsEditing(false);
  };

  // Options pour les selects
  const classOptions = [
    { value: "seconde", label: "Seconde" },
    { value: "premiere", label: "Première" },
    { value: "terminale", label: "Terminale" }
  ];

  const specialtyOptions = [
    { value: "general", label: "Général" },
    { value: "sciences", label: "Sciences" },
    { value: "litteraire", label: "Littéraire" },
    { value: "economique", label: "Économique et Social" }
  ];

  const notificationOptions = [
    { value: "all", label: "Toutes les notifications" },
    { value: "important", label: "Uniquement importantes" },
    { value: "none", label: "Aucune notification" }
  ];

  const themeOptions = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "auto", label: "Automatique" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <StudentPageHeader
        title="Mon Profil"
        subtitle="Gérez vos informations personnelles et préférences"
      />

      <div className="w-full px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* PHOTO DE PROFIL */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-poppins font-medium text-gray-900 mb-6">
              Photo de profil
            </h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-forest-400 to-forest-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-poppins font-semibold">
                    {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center hover:bg-forest-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-poppins font-medium text-gray-900">
                  {profile.name || 'Étudiant'}
                </h3>
                <p className="text-sm text-gray-600">Étudiant • {profile.account_type}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  {profile.email_verified_at && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Email vérifié
                    </span>
                  )}
                </div>
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Cliquez sur l'icône caméra pour changer votre photo
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  {loggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>

          {/* INFORMATIONS PERSONNELLES */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Informations personnelles
              </h2>
              {!isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="w-auto"
                >
                  Modifier
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                leftIcon={User}
                disabled={!isEditing}
                error={errors.firstName}
                required
              />

              <Input
                label="Nom"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                leftIcon={User}
                disabled={!isEditing}
                error={errors.lastName}
                required
              />

              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                leftIcon={Mail}
                disabled={true} // L'email ne peut pas être modifié
                required
              />

              <Input
                label="Téléphone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                leftIcon={Phone}
                disabled={!isEditing}
              />

              <Input
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                leftIcon={Calendar}
                disabled={!isEditing}
              />

              <Input
                label="Adresse"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                leftIcon={MapPin}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* INFORMATIONS DU COMPTE */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-poppins font-medium text-gray-900 mb-6">
              Informations du compte
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Date d'inscription</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Dernière modification</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BIOGRAPHIE */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-poppins font-medium text-gray-900 mb-6">
              À propos de moi
            </h2>

            <Textarea
              label="Biographie"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Parlez-nous de vous, vos intérêts, vos objectifs..."
              disabled={!isEditing}
              rows={4}
              maxLength={500}
              showCharCount={true}
            />
          </div>

          {/* PRÉFÉRENCES */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-poppins font-medium text-gray-900 mb-6">
              Préférences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="Notifications"
                value={formData.notifications}
                onChange={(e) => handleChange("notifications", e.target.value)}
                options={notificationOptions}
                leftIcon={Bell}
                disabled={!isEditing}
              />

              <SelectInput
                label="Thème"
                value={formData.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                options={themeOptions}
                leftIcon={Palette}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button type="submit" variant="primary" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder les modifications
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}