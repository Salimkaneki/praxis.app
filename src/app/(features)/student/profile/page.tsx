"use client";
import React, { useState } from "react";
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
  X
} from "lucide-react";

export default function StudentProfilePage() {
  // État du formulaire
  const [formData, setFormData] = useState({
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

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
                    {formData.firstName[0]}{formData.lastName[0]}
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
              <div>
                <h3 className="text-lg font-poppins font-medium text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-600">{formData.class} • {formData.specialty}</p>
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Cliquez sur l'icône caméra pour changer votre photo
                  </p>
                )}
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
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                leftIcon={Mail}
                disabled={!isEditing}
                error={errors.email}
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

          {/* INFORMATIONS ACADÉMIQUES */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-poppins font-medium text-gray-900 mb-6">
              Informations académiques
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectInput
                label="Classe"
                value={formData.class}
                onChange={(e) => handleChange("class", e.target.value)}
                options={classOptions}
                leftIcon={GraduationCap}
                disabled={true}
              />

              <SelectInput
                label="Spécialité"
                value={formData.specialty}
                onChange={(e) => handleChange("specialty", e.target.value)}
                options={specialtyOptions}
                leftIcon={BookOpen}
                disabled={true}
              />

              <Input
                label="Année scolaire"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                disabled={true}
              />
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