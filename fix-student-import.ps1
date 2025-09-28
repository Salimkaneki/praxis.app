@'
$content = Get-Content -Path "C:\Users\_Salim_mevtr_\_sout_\praxis\src\app\(features)\dashboard\student\import\page.tsx" -Raw
$content = $content -replace 'import ClasseService, \{ Classe \} from "@/app/\(features\)/dashboard/formation/classe/_services/classe.service";', 'import ClasseService, { Classe } from "../../../formation/classe/_services/classe.service";'
$content | Out-File -FilePath "C:\Users\_Salim_mevtr_\_sout_\praxis\src\app\(features)\dashboard\student\import\page.tsx" -Encoding UTF8
'@