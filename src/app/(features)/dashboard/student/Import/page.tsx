'use client';
import React, { useState, useRef, ChangeEvent } from "react";
import { 
  Upload, FileText, Sheet, Users, Download, 
  ArrowLeft, AlertCircle, CheckCircle, X,
  Eye, Trash2
} from "lucide-react";

// Types pour les données d'import
interface ImportedStudent {
  student_number?: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  class_id: string;
  gender: string;
  address?: string;
  errors?: string[];
}

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  duplicates: number;
}

export default function StudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportedStudent[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options pour les classes
  const classOptions = [
    { value: "1", label: "Licence 3 Informatique" },
    { value: "2", label: "Master 1 Génie Civil" },
    { value: "3", label: "Licence 2 Médecine" },
    { value: "4", label: "Master 2 Économie" }
  ];

  // Options pour le genre
  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" }
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier le type de fichier
    const validTypes = [
      'text/csv', 
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.csv') && 
        !selectedFile.name.endsWith('.xlsx')) {
      alert("Veuillez sélectionner un fichier CSV ou Excel valide.");
      return;
    }

    setFile(selectedFile);
    simulateFileProcessing(selectedFile);
  };

  const simulateFileProcessing = (selectedFile: File) => {
    // Simulation du traitement de fichier
    setIsImporting(true);
    
    setTimeout(() => {
      // Données simulées pour l'aperçu
      const simulatedData: ImportedStudent[] = [
        {
          first_name: "Jean",
          last_name: "Dupont",
          email: "jean.dupont@univ-lome.tg",
          birth_date: "2000-05-15",
          phone: "+228 90123456",
          class_id: "1",
          gender: "M",
          address: "Lomé, Quartier Administratif"
        },
        {
          first_name: "Marie",
          last_name: "Koné",
          email: "marie.kone@univ-lome.tg",
          birth_date: "2001-08-22",
          phone: "+228 90234567",
          class_id: "2",
          gender: "F",
          address: "Lomé, Nyékonakpoè"
        },
        {
          first_name: "Koffi",
          last_name: "Mensah",
          email: "koffi.mensah@univ-lome.tg",
          birth_date: "1999-12-03",
          phone: "+228 90345678",
          class_id: "3",
          gender: "M",
          errors: ["Format d'email invalide"]
        }
      ];
      
      setPreviewData(simulatedData);
      setIsImporting(false);
    }, 1500);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setImportResult(null);
    setImportStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!file || previewData.length === 0) return;

    setIsImporting(true);
    setImportStatus(null);

    try {
      // Simulation de l'importation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Résultats simulés
      const result: ImportResult = {
        success: 2,
        errors: 1,
        total: 3,
        duplicates: 0
      };
      
      setImportResult(result);
      setImportStatus('success');
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const getClassLabel = (classId: string) => {
    return classOptions.find(opt => opt.value === classId)?.label || classId;
  };

  const getGenderLabel = (gender: string) => {
    return genderOptions.find(opt => opt.value === gender)?.label || gender;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                  Importation d'Étudiants
                </h1>
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  Importez une liste d'étudiants via un fichier CSV ou Excel
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                className="px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Télécharger le modèle
                <Download className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus && (
        <div className="px-8 py-4">
          {importStatus === 'success' && importResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm font-poppins text-green-800 font-medium">
                  Importation terminée avec succès !
                </span>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <p>{importResult.success} étudiants importés avec succès</p>
                {importResult.errors > 0 && <p>{importResult.errors} erreurs</p>}
                {importResult.duplicates > 0 && <p>{importResult.duplicates} doublons ignorés</p>}
              </div>
            </div>
          )}
          {importStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-sm font-poppins text-red-800">
                Une erreur est survenue lors de l'importation. Veuillez réessayer.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-poppins font-semibold text-gray-900">
                  Importer un fichier
                </h2>
                <p className="text-sm font-poppins text-gray-600">
                  Sélectionnez un fichier CSV ou Excel contenant la liste des étudiants
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              
              {!file ? (
                <div>
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-poppins text-gray-600 mb-2">
                    Glissez-déposez votre fichier ici, ou
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm font-poppins font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                  <p className="text-xs font-poppins text-gray-500 mt-4">
                    Formats supportés: CSV, XLSX (Excel)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                      {file.name.endsWith('.csv') ? (
                        <FileText className="w-5 h-5 text-forest-600" />
                      ) : (
                        <Sheet className="w-5 h-5 text-forest-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-poppins font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs font-poppins text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {previewData.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full py-3 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></div>
                      Importation en cours...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2 inline" />
                      Importer {previewData.length} étudiants
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {previewData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-gray-900">
                    Aperçu des données ({previewData.length} étudiants)
                  </h2>
                  <p className="text-sm font-poppins text-gray-600">
                    Vérifiez les données avant l'importation
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Nom & Prénom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Genre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-poppins font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((student, index) => (
                      <tr key={index} className={student.errors ? "bg-red-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-poppins text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-xs font-poppins text-gray-500">
                            {student.birth_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-poppins text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-poppins text-gray-900">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-poppins text-gray-900">
                          {getClassLabel(student.class_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-poppins text-gray-900">
                          {getGenderLabel(student.gender)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.errors ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Erreur
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valide
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {previewData.some(student => student.errors) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-poppins font-medium text-red-800 mb-2">
                    Erreurs détectées:
                  </h3>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {previewData.flatMap((student, index) => 
                      student.errors?.map(error => 
                        <li key={`${index}-${error}`}>
                          Ligne {index + 1}: {student.first_name} {student.last_name} - {error}
                        </li>
                      ) || []
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}